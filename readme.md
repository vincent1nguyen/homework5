## Static Site Generator Exercise

The Eleventy exercise is located in [`ssg-exercise/`](./ssg-exercise/).

The exercise generates two pages from my existing portfolio:

- **Home:** `http://localhost:8080/`
- **Projects:** `http://localhost:8080/projects/`

See [`ssg-exercise/README.md`](./ssg-exercise/README.md) for installation, build, and preview instructions.

## Design Note: Sticky Notes and Cat Facts

The goal of the Sticky Notes component is to let visitors create and browse notes, including notes generated from live cat facts.

When a visitor clicks the **Get Cat Fact** button:

1. The button triggers the `getCatFact()` JavaScript method.
2. The method sends an HTTP request to `https://catfact.ninja/fact` using `fetch()`.
3. The response is converted to JSON, and the returned fact is passed to `addNote()`.
4. The component updates the DOM by adding a new sticky note containing the fact.

**While waiting:** The component displays a loading message and disables the button to prevent repeated requests.

**On success:** A new sticky note containing the cat fact appears, and the status message confirms that the fact was added.

**On failure:** The component displays an error message. The button is re-enabled so visitors can try again without refreshing the page.