//go:build js && wasm

// ubao: a virtual electronics board with 8 LEDs (taa), a buzzer (kengele)
// and a 16x2 text screen (skrini). Lets learners write "hardware" programs
// before they own a kit.
package main

import (
	"time"

	"github.com/NuruProgramming/Nuru/object"
)

const idadiYaTaa = 8

var hali [idadiYaTaa + 1]bool

func taaNamba(name string, args []object.Object) (int, *object.Error) {
	n, err := numbers(name, args[:1], 1)
	if err != nil {
		return 0, err
	}
	i := int(n[0])
	if float64(i) != n[0] || i < 1 || i > idadiYaTaa {
		return 0, kosa("%s: ubao una taa 1 hadi %d, hakuna taa namba %v", name, idadiYaTaa, n[0])
	}
	return i, nil
}

func wekaTaa(i int, on bool) {
	hali[i] = on
	emit("ubao", map[string]interface{}{"t": "led", "i": i, "on": on})
}

var ubaoFunctions = map[string]object.ModuleFunction{
	"washa": func(args []object.Object, _ map[string]object.Object) object.Object {
		if len(args) != 1 {
			return kosa("ubao.washa inahitaji namba ya taa, mfano ubao.washa(1)")
		}
		i, err := taaNamba("ubao.washa", args)
		if err != nil {
			return err
		}
		wekaTaa(i, true)
		return tupu
	},
	"zima": func(args []object.Object, _ map[string]object.Object) object.Object {
		if len(args) != 1 {
			return kosa("ubao.zima inahitaji namba ya taa, mfano ubao.zima(1)")
		}
		i, err := taaNamba("ubao.zima", args)
		if err != nil {
			return err
		}
		wekaTaa(i, false)
		return tupu
	},
	"geuza": func(args []object.Object, _ map[string]object.Object) object.Object {
		if len(args) != 1 {
			return kosa("ubao.geuza inahitaji namba ya taa")
		}
		i, err := taaNamba("ubao.geuza", args)
		if err != nil {
			return err
		}
		wekaTaa(i, !hali[i])
		return tupu
	},
	"washa_zote": func(args []object.Object, _ map[string]object.Object) object.Object {
		for i := 1; i <= idadiYaTaa; i++ {
			wekaTaa(i, true)
		}
		return tupu
	},
	"zima_zote": func(args []object.Object, _ map[string]object.Object) object.Object {
		for i := 1; i <= idadiYaTaa; i++ {
			wekaTaa(i, false)
		}
		return tupu
	},
	"imewaka": func(args []object.Object, _ map[string]object.Object) object.Object {
		if len(args) != 1 {
			return kosa("ubao.imewaka inahitaji namba ya taa")
		}
		i, err := taaNamba("ubao.imewaka", args)
		if err != nil {
			return err
		}
		return &object.Boolean{Value: hali[i]}
	},
	"rangi": func(args []object.Object, _ map[string]object.Object) object.Object {
		if len(args) != 2 {
			return kosa("ubao.rangi inahitaji namba ya taa na rangi, mfano ubao.rangi(1, \"kijani\")")
		}
		i, err := taaNamba("ubao.rangi", args)
		if err != nil {
			return err
		}
		c, cerr := tafsiriRangi(args[1])
		if cerr != nil {
			return cerr
		}
		emit("ubao", map[string]interface{}{"t": "color", "i": i, "c": c})
		return tupu
	},
	"kengele": func(args []object.Object, _ map[string]object.Object) object.Object {
		freq, ms := 440.0, 200.0
		if len(args) >= 1 {
			v, ok := namba(args[0])
			if !ok {
				return kosa("ubao.kengele(sauti, muda): sauti inapaswa kuwa namba (Hz)")
			}
			freq = v
		}
		if len(args) >= 2 {
			v, ok := namba(args[1])
			if !ok {
				return kosa("ubao.kengele(sauti, muda): muda inapaswa kuwa namba (milisekunde)")
			}
			ms = v
		}
		emit("ubao", map[string]interface{}{"t": "beep", "f": freq, "ms": ms})
		time.Sleep(time.Duration(ms) * time.Millisecond)
		return tupu
	},
	"skrini": func(args []object.Object, _ map[string]object.Object) object.Object {
		s := ""
		for i, a := range args {
			if i > 0 {
				s += " "
			}
			if str, ok := a.(*object.String); ok {
				s += str.Value
			} else {
				s += a.Inspect()
			}
		}
		emit("ubao", map[string]interface{}{"t": "lcd", "s": s})
		return tupu
	},
	"subiri": func(args []object.Object, _ map[string]object.Object) object.Object {
		n, err := numbers("ubao.subiri", args, 1)
		if err != nil {
			return err
		}
		if n[0] > 0 {
			time.Sleep(time.Duration(n[0]) * time.Millisecond)
		}
		return tupu
	},
}
