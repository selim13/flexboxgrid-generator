<script>
  import postcss from "postcss";
  import postcssJs from "postcss-js";
  import postcssCalc from "postcss-calc";
  import postcssAutoprefixer from "autoprefixer";
  import { contains } from "ramda";
  import defaultOptions from "./defaultOptions.json";
  import Grids from "./Grids.svelte";
  import getStyles from "./getStyles";
  import postcssPrettify from "./postcssPrettify.js";

  let breakpoints = [...defaultOptions.breakpoints];
  let grids = [...defaultOptions.grids];
  let defaultGrid = 12;
  let layoutPrefix = "";
  let utilityPrefix = "";
  let calc = true;
  let autoprefixer = false;
  let browserslist = defaultOptions.browserslist.join("\n");
  let code = getCode();

  function getCode() {
    const styles = getStyles({
      grids,
      defaultGrid,
      breakpoints,
      layoutPrefix,
      utilityPrefix
    });

    const enabledPostcssPlugins = [];
    if (calc) {
      enabledPostcssPlugins.push(postcssCalc);
    }
    if (autoprefixer) {
      enabledPostcssPlugins.push(
        postcssAutoprefixer({
          overrideBrowserslist: browserslist.split("\n")
        })
      );
    }
    enabledPostcssPlugins.push(postcssPrettify);

    return styles
      .map(
        c =>
          postcss(enabledPostcssPlugins).process(c, {
            from: undefined,
            parser: postcssJs
          }).css
      )
      .join("\n\n");
  }

  function handleBreakpointAdd() {
    breakpoints = [...breakpoints, {}];
  }

  function handleBreakpointChange(idx, key, value) {
    breakpoints = breakpoints.map((bp, i) =>
      i === idx ? { ...bp, [key]: value } : bp
    );
    console.log(breakpoints);
  }

  function handleGenerate() {
    code = getCode();
  }
</script>

<style>
  h1 {
    margin-bottom: 60px;
    text-align: center;
    text-transform: uppercase;
  }

  h2 {
    margin: 0 120px 40px 0;
    color: #2854a4;
    font-size: 24px;
    font-weight: 600;
  }

  h3 {
    margin-top: 0;
    font-size: 18px;
    font-weight: 600;
  }

  :global(.input) {
    width: 100%;
    height: 48px;
    min-width: 0;
    margin: 0;
    padding: 8px 16px;
    border: 1px solid #f0f0f0;
    border-radius: 4px;
    font-size: 18px;
    font-weight: 500;
    outline: none;
  }

  :global(.input:focus) {
    box-shadow: 0 0 0 2px #96b2f7;
    border-color: #96b2f7;
  }

  :global(.button) {
    height: 48px;
    margin: 0;
    padding: 8px 16px;
    border: 0;
    border-radius: 4px;
    background: #2854a4;
    font-size: 20px;
    font-weight: 500;
    color: #fff;
    cursor: pointer;
    outline: none;
  }

  :global(.button:focus) {
    /* border-color: #7790bf; */
    box-shadow: 0 0 0 2px #96b2f7;
  }

  :global(.button:hover) {
    background-color: #3f63bd;
  }

  textarea {
    width: 100%;
    min-width: 0;
    margin: 0;
    padding: 8px 16px;
    border: 1px solid #f0f0f0;
    border-radius: 4px;
    font-family: monospace;
    font-size: 18px;
    font-weight: 500;
    resize: vertical;
    outline: none;
  }

  textarea:focus {
    box-shadow: 0 0 0 2px #96b2f7;
    border-color: #96b2f7;
  }

  .container {
    margin: 0 auto;
    max-width: 960px;
  }

  .card {
    margin-bottom: 40px;
    padding: 32px 24px;
    border-width: 0;
    border-color: rgba(188, 188, 188, 1);
    border-radius: 5;
    border-style: solid;
    box-shadow: 0 5px 35px 0 rgba(50, 50, 93, 0.17);
    background-color: #ffffff;
  }

  .layout {
    display: grid;
    grid-template-columns: 1fr 4fr;
    grid-row-gap: 48px;
  }

  .breakpoints-table {
    margin: 0 -8px;
    border-collapse: separate;
    border-spacing: 8px;
  }

  .breakpoints-table td {
    padding: 0;
  }

  .prefixes {
    display: grid;
    grid-template-columns: 1fr 4fr;
    gap: 24px;
  }

  .add {
    width: 48px;
    margin-top: 16px;
  }

  .postcss {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-column-gap: 24px;
  }

  .postcss__plugin {
    display: block;
    margin-bottom: 8px;
  }

  .generate-wrap {
    margin-top: 48px;
    text-align: center;
  }
</style>

<h1>Flexboxgrid generator</h1>

<div class="container">
  <div class="card">
    <div class="layout">
      <h2>Grids</h2>
      <Grids defaultGrids={grids} on:grids={e => (grids = e.detail)} />

      <h2>Breakpoints</h2>
      <div>
        <table class="breakpoints-table">
          <tr>
            <th>Name</th>
            <th>Min-width</th>
            <th>Gutters</th>
          </tr>
          {#each breakpoints as bp, idx}
            <tr>
              <td>
                <input
                  type="text"
                  class="input"
                  autocomplete="off"
                  value={bp.name ? bp.name : ''}
                  on:input={e => handleBreakpointChange(idx, 'name', e.target.value)} />
              </td>
              <td>
                {#if idx !== 0}
                  <input
                    type="text"
                    class="input"
                    autocomplete="off"
                    value={bp.min ? bp.min : ''}
                    on:input={e => handleBreakpointChange(idx, 'min', e.target.value)} />
                {/if}
              </td>
              <td>
                <input
                  class="input"
                  type="text"
                  autocomplete="off"
                  value={bp.gutters ? bp.gutters : ''}
                  on:input={e => handleBreakpointChange(idx, 'gutters', e.target.value)} />
              </td>
            </tr>
          {/each}
        </table>
        <button class="button add" type="button" on:click={handleBreakpointAdd}>
          +
        </button>
      </div>

      <h2>Prefixes</h2>
      <div class="prefixes">
        <label for="prefix-layout">Layout prefix:</label>
        <input
          class="input"
          type="text"
          id="prefix-layout"
          placeholder="l-"
          bind:value={layoutPrefix} />
        <label for="prefix-utility">Utility prefix:</label>
        <input
          class="input"
          type="text"
          id="prefix-utility"
          placeholder="u-"
          bind:value={utilityPrefix} />
      </div>

      <h2>PostCSS</h2>
      <div class="postcss">
        <div>
          <h3>Plugins</h3>
          <label class="postcss__plugin">
            <input type="checkbox" bind:checked={calc} />
            calc()
          </label>
          <label class="postcss__plugin">
            <input type="checkbox" bind:checked={autoprefixer} />
            autoprefixer
          </label>
        </div>

        <div>
          <h3>Browserslist</h3>
          <textarea rows="5" bind:value={browserslist} />
        </div>
      </div>
    </div>

    <div class="generate-wrap">
      <button class="button" type="button" on:click={handleGenerate}>
        Generate Grid
      </button>
    </div>
  </div>

  <div class="card">
    <h2>Code</h2>
    <textarea rows="40" bind:value={code} />
  </div>
</div>
