// TODO: Add missing Annotations: link, 
// TODO: Add custom blocks: Image, CodeBlock.

import {
	defineSchema,
	EditorProvider,
	PortableTextEditable,
} from "@portabletext/editor";
import type {
	PortableTextBlock,
	RenderDecoratorFunction,
	RenderStyleFunction,
} from "@portabletext/editor";
import { bold } from "@portabletext/keyboard-shortcuts";
import {
	useDecoratorButton,
	useStyleSelector,
	useToolbarSchema,
	type ExtendDecoratorSchemaType,
	type ExtendStyleSchemaType,
	type ToolbarSchema,
	type ToolbarDecoratorSchemaType,
	type ToolbarStyleSchemaType,
} from "@portabletext/toolbar";

import { EventListenerPlugin } from "@portabletext/editor/plugins";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
	cn
} from "@nuru/ui";

import {
	BoldIcon,
	UnderlineIcon,
	ChevronDownIcon,
	TextQuoteIcon,
	ItalicIcon,
	CodeIcon,
} from "lucide-react";

// ...
const schemaDefinition = defineSchema({
	// Decorators are simple marks that don't hold any data
	decorators: [
		{ name: "strong" },
		{ name: "em" },
		{ name: "underline" },
		{ name: "code" },
	],
	// Styles apply to entire text blocks
	// There's always a 'normal' style that can be considered the paragraph style
	styles: [
		{ name: "normal" },
		{ name: "h1" },
		{ name: "h2" },
		{ name: "h3" },
		{ name: "h4" },
		{ name: "h5" },
		{ name: "h6" },
		{ name: "blockquote" },
	],

	// The types below are left empty for this example.
	// See the rendering guide to learn more about each type.

	// Annotations are more complex marks that can hold data (for example, hyperlinks).
	annotations: [],
	// Lists apply to entire text blocks as well (for example, bullet, numbered).
	lists: [],
	// Inline objects hold arbitrary data that can be inserted into the text (for example, custom emoji).
	inlineObjects: [],
	// Block objects hold arbitrary data that live side-by-side with text blocks (for example, images, code blocks, and tables).
	blockObjects: [],
});

const renderStyle: RenderStyleFunction = (props) => {
	if (props.schemaType.value === "h1") {
		return <h1>{props.children}</h1>;
	}
	if (props.schemaType.value === "h2") {
		return <h2>{props.children}</h2>;
	}
	if (props.schemaType.value === "h3") {
		return <h3>{props.children}</h3>;
	}
	if (props.schemaType.value === "blockquote") {
		return <blockquote>{props.children}</blockquote>;
	}
	return <>{props.children}</>;
};

const renderDecorator: RenderDecoratorFunction = (props) => {
	if (props.value === "strong") {
		return <strong>{props.children}</strong>;
	}
	if (props.value === "em") {
		return <em>{props.children}</em>;
	}
	if (props.value === "underline") {
		return <u>{props.children}</u>;
	}
	if (props.value === "code") {
		return <code>{props.children}</code>;
	}
	return <>{props.children}</>;
};

// --------------- Toolbar configuration
// Extend the schema with icons, titles, and keyboard shortcuts

const extendStyle: ExtendStyleSchemaType = (style) => {
	// Apply updates to the schema, if needed
	const headingStyles = {
		h1: "Heading 1",
		h2: "Heading 2",
		h3: "Heading 3",
		h4: "Heading 4",
		h5: "Heading 5",
		h6: "Heading 6",
	};

	if (style.name in headingStyles) {
		return {
			...style,
			title: headingStyles[style.name as keyof typeof headingStyles],
		};
	}

	if (style.name === "blockquote") {
		return {
			...style,
			title: "Blockquote",
			icon: () => <TextQuoteIcon size={16} />,
		};
	}
	// ...repeat for each style type, or return the original style
	return style;
};
const extendDecorator: ExtendDecoratorSchemaType = (decorator) => {
	if (decorator.name === "strong") {
		return {
			...decorator,
			// Optional: add a react component as an icon and unset the title
			icon: () => <BoldIcon size={16} />,
			// Optional: connect to a keyboard shortcut from the keyboard-shortcuts library
			shortcut: bold,
			title: "",
		};
	}
	if (decorator.name === "underline") {
		return {
			...decorator,
			icon: () => <UnderlineIcon size={16} />,
			shortcut: bold,
			title: "",
		};
	}

	if (decorator.name === "em") {
		return {
			...decorator,
			icon: () => <ItalicIcon size={16} />,
			title: "Italic",
		};
	}

	if (decorator.name === "code") {
		return {
			...decorator,
			icon: () => <CodeIcon size={16} />,
			title: "Code",
		};
	}

	// ...repeat for each decorator type, or return the original decorator
	return decorator;
};

// Create a button for each decorator type
const DecoratorButton = (props: { schemaType: ToolbarDecoratorSchemaType }) => {
	const decoratorButton = useDecoratorButton(props);
	return (
		<button
			type="button"
			onClick={() => decoratorButton.send({ type: "toggle" })}
			className={cn(
				decoratorButton.snapshot.matches({ enabled: "active" })
					? "bg-muted/80 stroke-2 font-semibold"
					: "",
				"hover:bg-muted/80 border-r px-4",
			)}
		>
			{props.schemaType.icon ? (
				<props.schemaType.icon />
			) : (
				<>{props.schemaType.title}</>
			)}
		</button>
	);
};
function StyleButton(props: { schemaType: ToolbarStyleSchemaType }) {
	const styleSelector = useStyleSelector({ schemaTypes: [props.schemaType] });
	return (
		<DropdownMenuItem
			onClick={(e) => {
				e.preventDefault();
				styleSelector.send({ type: "toggle", style: props.schemaType.name });
				console.log("Style selected:", props.schemaType.name);
			}}
			className={cn(
				styleSelector.snapshot.matches("enabled") ? "active" : "",
				"flex items-center gap-1",
			)}
		>
			{props.schemaType.icon && <props.schemaType.icon />}
			{props.schemaType.title}
		</DropdownMenuItem>
	);
}

function Toolbar() {
	// useToolbarSchema provides access to the PTE schema
	// optionally, pass in updated schemas to override the default
	const toolbarSchema = useToolbarSchema({
		extendDecorator, // see declarations below
		extendStyle, // see declarations below
	});

	return (
		<div className="flex border-b dark:bg-neutral-900">
			<DropdownMenu>
				<DropdownMenuTrigger
					asChild
					onClick={(e) => {
						e.preventDefault();
					}}
				>
					<button className="hover:bg-muted/80 flex items-center gap-1 rounded-none border-r px-2 py-1 outline-none">
						<p className="!my-0 px-5">Styles</p>
						<ChevronDownIcon size={16} className="text-muted-foreground mr-2" />
					</button>
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					{toolbarSchema.styles?.map((style) => (
						<StyleButton key={style.name} schemaType={style} />
					))}
				</DropdownMenuContent>
			</DropdownMenu>
			{toolbarSchema.decorators?.map((decorator) => (
				<DecoratorButton key={decorator.name} schemaType={decorator} />
			))}
			{/* {toolbarSchema.styles?.map((style) => (
				<StyleButton key={style.name} schemaType={style} />
			))} */}
		</div>
	);
}

// ------------------------

import { useEffect, useState } from "react";

export default function PortableTextEditor({
	value,
	onChange,
	className,
}: {
	value?: Array<PortableTextBlock>;
	onChange: (value: Array<PortableTextBlock>) => void;
	className?: string;
}) {
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	if (!isMounted) {
		return <div className={cn("min-h-40 border p-2", className)}>Loading editor...</div>;
	}

	return (
		<div
			className={cn(
				"prose prose-neutral dark:prose-invert max-w-none border",
				className,
			)}
		>
			<EditorProvider
				initialConfig={{
					schemaDefinition,
					initialValue: value,
				}}
			>
				<Toolbar />
				<EventListenerPlugin
					on={(event) => {
						if (event.type === "mutation" && event.value) {
							onChange(event.value);
						}
					}}
				/>
				<PortableTextEditable
					className="min-h-40 max-h-80 overflow-hidden overflow-y-auto p-2 focus-within:border-none focus-within:ring-0 focus:border-none focus:ring-0 focus-visible:outline-none"
					renderStyle={renderStyle}
					renderDecorator={renderDecorator}
					renderBlock={(props) => <div>{props.children}</div>}
					renderListItem={(props) => <>{props.children}</>}
				/>
			</EditorProvider>
		</div>
	);
}
