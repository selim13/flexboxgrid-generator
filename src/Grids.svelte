<script>
  export let defaultGrids = [12];
  import { createEventDispatcher } from "svelte";

  let grids = defaultGrids;
  let focused = null;
  const dispatch = createEventDispatcher();

  function handleAdd() {
    grids = [...grids, 12];
  }

  function handleRemove(idx) {
    grids = [...grids.slice(0, idx), ...grids.slice(idx + 1)];
  }

  function handleChange(idx, value) {
    grids = grids.map((grid, i) => (i === idx ? parseInt(value, 10) : grid));
  }

  $: dispatch("grids", grids);
</script>

<style>
  .grids {
    display: flex;
    flex-flow: row wrap;
  }

  .grid {
    position: relative;
    margin: 0 8px 16px 8px;
  }

  .input {
    width: 48px;
    padding: 8px;
    text-align: center;
    -moz-appearance: textfield;
  }

  .input::-webkit-inner-spin-button,
  .input::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0; /* Removes leftover margin */
  }

  .add {
    width: 48px;
    margin: 0 8px 16px 8px;
  }

  .remove {
    position: absolute;
    top: -12px;
    right: -12px;
    width: 24px;
    height: 24px;
    margin: 0 8px;
    border: 2px solid transparent;
    border-radius: 100%;
    background: #d40505;
    font-size: 16px;
    font-weight: 500;
    color: #fff;
    cursor: pointer;
    outline: none;
  }
</style>

<div class="grids">
  {#each grids as grid, idx}
    <div
      class="grid"
      on:mouseover={() => (focused = idx)}
      on:mouseleave={() => (focused = null)}>
      <input
        class="input"
        type="number"
        value={grid}
        autocomplete="none"
        on:input={e => handleChange(idx, e.target.value)} />
      {#if grids.length > 1 && focused === idx}
        <button class="remove" type="button" on:click={() => handleRemove(idx)}>
          &times;
        </button>
      {/if}
    </div>
  {/each}
  <button class="button add" type="button" on:click={handleAdd}>+</button>
</div>
