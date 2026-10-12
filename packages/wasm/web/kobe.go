//go:build js && wasm

// kobe: turtle graphics ("kobe" is Swahili for tortoise).
// Origin is the centre of a 600x600 canvas, y grows upward, heading 0 faces east.
package main

import (
	"math"
	"strings"

	"github.com/NuruProgramming/Nuru/object"
)

var rangiMajina = map[string]string{
	"nyeusi":    "#111111",
	"nyeupe":    "#ffffff",
	"nyekundu":  "#e63b2e",
	"kijani":    "#2f9e44",
	"bluu":      "#1c6dd0",
	"samawati":  "#4dabf7",
	"njano":     "#ffd43b",
	"machungwa": "#fd7e14",
	"zambarau":  "#7048e8",
	"waridi":    "#f783ac",
	"kahawia":   "#8b5a2b",
	"kijivu":    "#868e96",
	"dhahabu":   "#e8b100",
	"fedha":     "#c0c0c0",
}

type kobeState struct {
	x, y, heading float64
	penDown       bool
	color         string
	fill          string
	width         float64
	filling       bool
	fillPath      [][2]float64
}

var k kobeState

func resetKobe() {
	k = kobeState{penDown: true, color: "#111111", fill: "#ffd43b", width: 2}
}

func tafsiriRangi(o object.Object) (string, *object.Error) {
	s, ok := neno(o)
	if !ok {
		return "", kosa("rangi inapaswa kuwa neno, kama \"nyekundu\" au \"#ff0000\"")
	}
	s = strings.ToLower(strings.TrimSpace(s))
	if strings.HasPrefix(s, "#") && (len(s) == 7 || len(s) == 4) {
		return s, nil
	}
	if hex, ok := rangiMajina[s]; ok {
		return hex, nil
	}
	majina := make([]string, 0, len(rangiMajina))
	for jina := range rangiMajina {
		majina = append(majina, jina)
	}
	return "", kosa("Sijui rangi \"%s\". Jaribu: %s", s, strings.Join(majina, ", "))
}

func sogea(umbali float64) {
	rad := k.heading * math.Pi / 180
	nx := k.x + umbali*math.Cos(rad)
	ny := k.y + umbali*math.Sin(rad)
	if k.penDown {
		emit("kobe", map[string]interface{}{"t": "line", "x1": k.x, "y1": k.y, "x2": nx, "y2": ny, "c": k.color, "w": k.width})
	} else {
		emit("kobe", map[string]interface{}{"t": "move", "x": nx, "y": ny})
	}
	k.x, k.y = nx, ny
	if k.filling {
		k.fillPath = append(k.fillPath, [2]float64{nx, ny})
	}
}

func geuka(digrii float64) {
	k.heading = math.Mod(k.heading+digrii, 360)
	if k.heading < 0 {
		k.heading += 360
	}
	emit("kobe", map[string]interface{}{"t": "turn", "h": k.heading})
}

var tupu = &object.Null{}

var kobeFunctions = map[string]object.ModuleFunction{
	"mbele": func(args []object.Object, _ map[string]object.Object) object.Object {
		n, err := numbers("kobe.mbele", args, 1)
		if err != nil {
			return err
		}
		sogea(n[0])
		return tupu
	},
	"nyuma": func(args []object.Object, _ map[string]object.Object) object.Object {
		n, err := numbers("kobe.nyuma", args, 1)
		if err != nil {
			return err
		}
		sogea(-n[0])
		return tupu
	},
	"kushoto": func(args []object.Object, _ map[string]object.Object) object.Object {
		n, err := numbers("kobe.kushoto", args, 1)
		if err != nil {
			return err
		}
		geuka(n[0])
		return tupu
	},
	"kulia": func(args []object.Object, _ map[string]object.Object) object.Object {
		n, err := numbers("kobe.kulia", args, 1)
		if err != nil {
			return err
		}
		geuka(-n[0])
		return tupu
	},
	"elekea": func(args []object.Object, _ map[string]object.Object) object.Object {
		n, err := numbers("kobe.elekea", args, 1)
		if err != nil {
			return err
		}
		geuka(n[0] - k.heading)
		return tupu
	},
	"nenda": func(args []object.Object, _ map[string]object.Object) object.Object {
		n, err := numbers("kobe.nenda", args, 2)
		if err != nil {
			return err
		}
		if k.penDown {
			emit("kobe", map[string]interface{}{"t": "line", "x1": k.x, "y1": k.y, "x2": n[0], "y2": n[1], "c": k.color, "w": k.width})
		} else {
			emit("kobe", map[string]interface{}{"t": "move", "x": n[0], "y": n[1]})
		}
		k.x, k.y = n[0], n[1]
		if k.filling {
			k.fillPath = append(k.fillPath, [2]float64{k.x, k.y})
		}
		return tupu
	},
	"nyumbani": func(args []object.Object, _ map[string]object.Object) object.Object {
		k.x, k.y, k.heading = 0, 0, 0
		emit("kobe", map[string]interface{}{"t": "move", "x": 0.0, "y": 0.0})
		emit("kobe", map[string]interface{}{"t": "turn", "h": 0.0})
		return tupu
	},
	"kalamu_juu": func(args []object.Object, _ map[string]object.Object) object.Object {
		k.penDown = false
		return tupu
	},
	"kalamu_chini": func(args []object.Object, _ map[string]object.Object) object.Object {
		k.penDown = true
		return tupu
	},
	"rangi": func(args []object.Object, _ map[string]object.Object) object.Object {
		if len(args) != 1 {
			return kosa("kobe.rangi inahitaji rangi moja, mfano kobe.rangi(\"nyekundu\")")
		}
		c, err := tafsiriRangi(args[0])
		if err != nil {
			return err
		}
		k.color = c
		return tupu
	},
	"rangi_ya_ndani": func(args []object.Object, _ map[string]object.Object) object.Object {
		if len(args) != 1 {
			return kosa("kobe.rangi_ya_ndani inahitaji rangi moja, mfano kobe.rangi_ya_ndani(\"njano\")")
		}
		c, err := tafsiriRangi(args[0])
		if err != nil {
			return err
		}
		k.fill = c
		return tupu
	},
	"unene": func(args []object.Object, _ map[string]object.Object) object.Object {
		n, err := numbers("kobe.unene", args, 1)
		if err != nil {
			return err
		}
		k.width = math.Max(0.5, n[0])
		return tupu
	},
	"anza_kujaza": func(args []object.Object, _ map[string]object.Object) object.Object {
		k.filling = true
		k.fillPath = [][2]float64{{k.x, k.y}}
		return tupu
	},
	"maliza_kujaza": func(args []object.Object, _ map[string]object.Object) object.Object {
		if !k.filling {
			return kosa("Tumia kobe.anza_kujaza() kabla ya kobe.maliza_kujaza()")
		}
		pts := make([]interface{}, 0, len(k.fillPath)*2)
		for _, p := range k.fillPath {
			pts = append(pts, p[0], p[1])
		}
		emit("kobe", map[string]interface{}{"t": "fill", "pts": pts, "c": k.fill})
		k.filling = false
		k.fillPath = nil
		return tupu
	},
	"duara": func(args []object.Object, _ map[string]object.Object) object.Object {
		n, err := numbers("kobe.duara", args, 1)
		if err != nil {
			return err
		}
		var fill interface{} = nil
		if k.filling {
			fill = k.fill
		}
		emit("kobe", map[string]interface{}{"t": "circle", "x": k.x, "y": k.y, "r": math.Abs(n[0]), "c": k.color, "w": k.width, "f": fill})
		return tupu
	},
	"nukta": func(args []object.Object, _ map[string]object.Object) object.Object {
		size := 8.0
		if len(args) == 1 {
			n, err := numbers("kobe.nukta", args, 1)
			if err != nil {
				return err
			}
			size = n[0]
		}
		emit("kobe", map[string]interface{}{"t": "dot", "x": k.x, "y": k.y, "r": size / 2, "c": k.color})
		return tupu
	},
	"maandishi": func(args []object.Object, _ map[string]object.Object) object.Object {
		if len(args) < 1 || len(args) > 2 {
			return kosa("kobe.maandishi inahitaji maandishi, na ukubwa (hiari)")
		}
		size := 18.0
		if len(args) == 2 {
			if v, ok := namba(args[1]); ok {
				size = v
			}
		}
		emit("kobe", map[string]interface{}{"t": "text", "x": k.x, "y": k.y, "s": args[0].Inspect(), "c": k.color, "size": size})
		return tupu
	},
	"mandhari": func(args []object.Object, _ map[string]object.Object) object.Object {
		if len(args) != 1 {
			return kosa("kobe.mandhari inahitaji rangi moja")
		}
		c, err := tafsiriRangi(args[0])
		if err != nil {
			return err
		}
		emit("kobe", map[string]interface{}{"t": "bg", "c": c})
		return tupu
	},
	"kasi": func(args []object.Object, _ map[string]object.Object) object.Object {
		n, err := numbers("kobe.kasi", args, 1)
		if err != nil {
			return err
		}
		emit("kobe", map[string]interface{}{"t": "speed", "v": math.Max(0, math.Min(10, n[0]))})
		return tupu
	},
	"futa": func(args []object.Object, _ map[string]object.Object) object.Object {
		emit("kobe", map[string]interface{}{"t": "clear"})
		return tupu
	},
	"ficha": func(args []object.Object, _ map[string]object.Object) object.Object {
		emit("kobe", map[string]interface{}{"t": "hide"})
		return tupu
	},
	"onyesha": func(args []object.Object, _ map[string]object.Object) object.Object {
		emit("kobe", map[string]interface{}{"t": "show"})
		return tupu
	},
	"mahali": func(args []object.Object, _ map[string]object.Object) object.Object {
		return &object.Array{Elements: []object.Object{floatObj(math.Round(k.x*100) / 100), floatObj(math.Round(k.y*100) / 100)}}
	},
	"mwelekeo": func(args []object.Object, _ map[string]object.Object) object.Object {
		return floatObj(math.Round(k.heading*100) / 100)
	},
}
