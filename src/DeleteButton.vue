<template>
  <button @click.stop=confirm class='mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--raised mdl-button--accent'><Icon>delete_forever</Icon></button>
</template>

<script>
export default {
  props: ['id'],
  methods: {
    confirm: function () {
      if (confirm(this.id + 'を削除しますか?')) {
        this.$emit('delete')
      }
    }
  }
}
</script>
