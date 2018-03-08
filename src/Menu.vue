<template>
  <nav class="mdl-navigation">
    <a class="mdl-navigation__link" @click='goto("sales")'><i class='material-icons'>store</i> 販売</a>
    <a class="mdl-navigation__link" @click='goto("inventory")'><i class='material-icons'>view_module</i> 在庫</a>
    <hr/>
    <a class="mdl-navigation__link" @click='goto("settings")'><i class='material-icons'>settings</i> 管理</a>
  </nav>
</template>

<script>
export default {
  methods: {
    goto: function (target) {
      this.$router.push(target)
    }
  }
}
</script>
