<template>
  <div>
    <label id='csv_up' class='mdl-button mdl-js-button mdl-button--colored' for='csv'>
      <Icon>file_upload</Icon>
      <input id='csv' class='mdl-textfield__input' type='file' accept='text/csv' @change='read'>
    </label>
    <span class="mdl-tooltip" data-mdl-for="csv_up">CSVアップロード</span>
  </div>
</template>

<script>
export default {
  methods: {
    read: function (e) {
      let file = e.target.files[0]
      if (file) {
        var r = new FileReader()
        r.onload = (e) => {
          let data = []
          r.result.split(/\r?\n/).forEach((row) => {
            if (row === '') {
              return
            }
            let rowArray = []
            row.split(',').forEach((column, index) => {
              rowArray.push(column)
            })
            data.push(rowArray)
          })
          this.$emit('read', data)
        }
        r.readAsText(file)
      }
    }
  }
}
</script>

<style scoped lang='scss'>
#csv_up {
  padding: initial;
  #csv {
    display: none;
  }
}
</style>
