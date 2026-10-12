//go:build js && wasm

// Nuru web entrypoint. Wraps the upstream interpreter (core/Nuru, untouched)
// and registers browser-only modules: kobe (turtle graphics) and ubao (virtual
// electronics board). Meant to run inside a Web Worker: runCode returns at once
// and the program runs on its own goroutine, so muda.lala and ubao.subiri can
// sleep without deadlocking the JS event loop.
package main

import (
	"github.com/NuruProgramming/Nuru/evaluator"
	"github.com/NuruProgramming/Nuru/lexer"
	"github.com/NuruProgramming/Nuru/module"
	"github.com/NuruProgramming/Nuru/object"
	"github.com/NuruProgramming/Nuru/parser"

	"syscall/js"
)

func emitOutput(text string, isError bool) {
	js.Global().Get("nuruOutputReceiver").Invoke(text, isError)
}

func emitDone() {
	if done := js.Global().Get("nuruDone"); done.Type() == js.TypeFunction {
		done.Invoke()
	}
}

func run(code string) {
	defer emitDone()
	defer func() {
		if r := recover(); r != nil {
			emitOutput("Kosa la ndani: programu imesimama ghafla.", true)
		}
	}()

	resetKobe()

	l := lexer.New(code)
	p := parser.New(l)
	program := p.ParseProgram()

	if len(p.Errors()) != 0 {
		emitOutput("Kuna makosa yafuatayo:", true)
		for _, msg := range p.Errors() {
			emitOutput("\t"+msg, true)
		}
		return
	}

	env := object.NewEnvironment()
	evaluated := evaluator.Eval(program, env)
	if evaluated != nil && evaluated.Type() != object.NULL_OBJ {
		emitOutput(evaluated.Inspect(), evaluated.Type() == object.ERROR_OBJ)
	}
}

func runCode(this js.Value, args []js.Value) interface{} {
	code := args[0].String()

	evaluator.StinBuffer = nil
	if len(args) > 1 && args[1].Type() == js.TypeObject {
		n := args[1].Length()
		evaluator.StinBuffer = make([]string, n)
		for i := 0; i < n; i++ {
			evaluator.StinBuffer[i] = args[1].Index(i).String()
		}
	}

	go run(code)
	return nil
}

func main() {
	module.Mapper["kobe"] = &object.Module{Name: "kobe", Functions: kobeFunctions}
	module.Mapper["ubao"] = &object.Module{Name: "ubao", Functions: ubaoFunctions}

	js.Global().Set("runCode", js.FuncOf(runCode))
	if ready := js.Global().Get("nuruReady"); ready.Type() == js.TypeFunction {
		ready.Invoke()
	}
	<-make(chan bool)
}
