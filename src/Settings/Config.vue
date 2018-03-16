<template>
<div>
  <select @change='change_color' id='color-primary' name='color-primary'>
    <option value='deep_orange'>Deep Orange</option>
    <option value='red'>Red</option>
    <option value='pink'>Pink</option>
    <option value='purple'>Purple</option>
    <option value='deep_purple'>Deep Purple</option>
    <option value='indigo'>Indigo</option>
    <option selected value='blue'>Blue</option>
    <option value='light_blue'>Light Blue</option>
    <option value='cyan'>Cyan</option>
    <option value='teal'>Teal</option>
    <option value='green'>Green</option>
    <option value='light_green'>Light Green</option>
    <option value='lime'>Lime</option>
    <option value='yellow'>Yellow</option>
    <option value='amber'>Amber</option>
    <option value='orange'>Orange</option>
    <option value='brown'>Brown</option>
    <option value='blue_grey'>Blue Grey</option>
    <option value='grey'>Grey</option>
  </select>
  <select @change='change_color' id='color-accent' name='color-accent'>
    <option value='deep_orange'>Deep Orange</option>
    <option value='red'>Red</option>
    <option value='pink'>Pink</option>
    <option selected value='purple'>Purple</option>
    <option value='deep_purple'>Deep Purple</option>
    <option value='indigo'>Indigo</option>
    <option value='blue'>Blue</option>
    <option value='light_blue'>Light Blue</option>
    <option value='cyan'>Cyan</option>
    <option value='teal'>Teal</option>
    <option value='green'>Green</option>
    <option value='light_green'>Light Green</option>
    <option value='lime'>Lime</option>
    <option value='yellow'>Yellow</option>
    <option value='amber'>Amber</option>
    <option value='orange'>Orange</option>
  </select>
</div>
</template>

<script>
export default {
  methods: {
    change_color: function () {
      var primary = document.getElementById('color-primary').value
      console.log(primary)
      var accent = document.getElementById('color-accent').value
      console.log(accent)
      document.head.querySelectorAll('link[href*="code.getmdl.io"]').forEach((l) => {
        l.setAttribute('href', 'https://code.getmdl.io/1.3.0/material.' + primary + '-' + accent + '.min.css')
        console.log('done!!')
      })
    }
  }
}
</script>
