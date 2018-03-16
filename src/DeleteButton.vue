<template>
  <button @click=confirm class='mdl-button mdl-js-button mdl-button--raised mdl-button--accent'><i class='material-icons'>delete_forever</i></button>
</template>

<script>
export default {
  props: ['id'],
  methods: {
    confirm: function () {
      if (confirm(this.id + 'を削除しますか?')) {
        this.$emit('click')
      }
    }
  }
}
</script>
