<template>
<div>
  <select @change='change_color' v-model=color_primary id='color-primary' name='color-primary'>
    <option v-for='(v, k) in primary' :value=k >{{v}}</option>
  </select>
  <select @change='change_color' v-model=color_accent id='color-accent' name='color-accent'>
    <option v-for='(v, k) in accent' :value=k >{{v}}</option>
  </select>
</div>
</template>

<script>
export default {
  data: function () {
    return {
      color_primary: 'blue',
      color_accent: 'purple',
      colors: {
        deep_orange: 'Deep Orange',
        red: 'Red',
        pink: 'Pink',
        purple: 'Purple',
        deep_purple: 'Deep Purple',
        indigo: 'Indigo',
        blue: 'Blue',
        light_blue: 'Light Blue',
        cyan: 'Cyan',
        teal: 'Teal',
        green: 'Green',
        light_green: 'Light Green',
        lime: 'Lime',
        yellow: 'Yellow',
        amber: 'Amber',
        orange: 'Orange',
        brown: 'Brown',
        blue_grey: 'Blue Grey',
        grey: 'Grey'
      }
    }
  },
  methods: {
    change_color: function () {
      document.head.querySelectorAll('link[href*="code.getmdl.io"]').forEach((l) => {
        l.setAttribute('href', 'https://code.getmdl.io/1.3.0/material.' + this.color_primary + '-' + this.color_accent + '.min.css')
      })
    }
  },
  computed: {
    primary: function () {
      let data = {}
      for (let k in this.colors) {
        if (k !== this.color_accent) {
          data[k] = this.colors[k]
        }
      }
      return data
    },
    accent: function () {
      let data = {}
      for (let k in this.colors) {
        if (k !== this.color_primary && k !== 'brown' && k !== 'blue_grey' && k !== 'grey') {
          data[k] = this.colors[k]
        }
      }
      return data
    }
  }
}
</script>
