<script lang="ts">
import type { ThingStore, Profile } from '../types';
export let profileStore: ThingStore<Profile>;

</script>

<div class="profile">
  <!-- This will put an undefined on the page, BTW.
  { console.log('Profile component store:', $profileStore) }
  -->
  <h2 contenteditable="true" bind:innerHTML={$profileStore.title} class="title"></h2>
</div>
