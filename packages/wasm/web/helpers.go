//go:build js && wasm

package main

import (
	"fmt"
	"syscall/js"

	"github.com/NuruProgramming/Nuru/object"
)

func kosa(format string, a ...interface{}) *object.Error {
	return &object.Error{Message: fmt.Sprintf(format, a...)}
}

func namba(o object.Object) (float64, bool) {
	switch v := o.(type) {
	case *object.Integer:
		return float64(v.Value), true
	case *object.Float:
		return v.Value, true
	}
	return 0, false
}

func neno(o object.Object) (string, bool) {
	if s, ok := o.(*object.String); ok {
		return s.Value, true
	}
	return "", false
}

// numbers reads exactly n numeric args, or explains in Swahili what went wrong.
func numbers(name string, args []object.Object, n int) ([]float64, *object.Error) {
	if len(args) != n {
		return nil, kosa("%s inahitaji hoja %d, wewe umeweka %d", name, n, len(args))
	}
	out := make([]float64, n)
	for i, a := range args {
		v, ok := namba(a)
		if !ok {
			return nil, kosa("%s inahitaji namba, lakini hoja ya %d ni %s", name, i+1, a.Type())
		}
		out[i] = v
	}
	return out, nil
}

// emit sends a drawing/board event to JS land as a plain object.
func emit(channel string, fields map[string]interface{}) {
	fn := js.Global().Get("nuruEvent")
	if fn.Type() != js.TypeFunction {
		return
	}
	fields["ch"] = channel
	fn.Invoke(js.ValueOf(fields))
}

func floatObj(v float64) object.Object {
	if v == float64(int64(v)) {
		return &object.Integer{Value: int64(v)}
	}
	return &object.Float{Value: v}
}
