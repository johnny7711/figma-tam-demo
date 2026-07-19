# Target Figma Slides via a Plugin

We chose **Figma Slides** as the rendering target and a Figma Plugin (the **Slide Generator Plugin**) as the generator, rather than building custom slide components inside a regular Figma Design file or rendering elsewhere.

The decisive reason is **Auto Layout**. Figma's Auto Layout lets us emit slide content as nested frames with direction + padding + gap, and Figma resizes/repositions everything as content length changes. This means the LLM never needs to compute pixel coordinates or worry about overflow — it picks a Slide Layout and fills Slots, and the visual composition resolves itself. Figma Slides also gives us native deck semantics (1920×1080 SlideNodes, slide rows, presentation mode, thumbnails) for free.

Writes to a Figma file can only happen from inside the Plugin runtime: the Figma REST API does not expose node creation, so any non-trivial automation must run as a Plugin regardless. Accepted trade-offs: Figma Slides' Plugin API forbids `createComponent`, `createStyle`, `createVariable`, and library imports, so the Plugin must build every Slide from primitives and cannot share a Figma component library. There is also no Plugin-API surface for the user-facing Figma Slides "template" concept, so our Theme system lives entirely in Plugin-bundled JSON rather than in Figma assets.
