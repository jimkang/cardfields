<script lang="ts">
// @ts-check
import type { Card } from '../types';
import { version } from '../package.json';

interface Test {
  a: number;
  b: string;
}

var test: Test = {
  a: 1,
  b: 'b'
};

var card: Card = {
  id: 'c1',
  text: 'hey',
  tags: []
};
</script>

<main>
  <h1>Cardfields</h1>
  <div>Observe what you do</div>
{test.a} {test.b}
{card.id}

  <div id="version-info">{version}</div>
</main>

<footer>
</footer>
