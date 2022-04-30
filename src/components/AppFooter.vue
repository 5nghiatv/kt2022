<template>
  <CFooter :fixed="false" v-if="!this.$store.state.isPrinting">
    <div>
      <a href="https://sites.google.com/site/nghiatv02/" target="_blank"
        >XuânMai.Corpt</a
      >
      <span class="ml-1">&copy; {{ new Date().getFullYear() }} </span>
    </div>
    <div class="ml-auto">
      <span class="mr-1">Powered by:</span>
      <a
        href="https://9d6891d6-a-62cb3a1a-s-sites.googlegroups.com/site/nghiatv02/home/Ban%20Quyen%20KeToan%20ACN.jpg?attachauth=ANoY7coO1P5g0_06yhv5AMFbw8QzLOXudOAUoAxrf92BV5cybMVZYZVADTfnkPJTkmEK0SAaX2rwp7bdNKeA8z9yEQ6Cta-u8k0JCBFSAgdlL__xc7rJMBvUb0IOFz1tzC0EjjTGsfwr0siUGW83sEL6R8Kaq2xfR6bt6eD-FS5KBHDIYDopHiH7eijZTtLqJWTPsVTMgioipf4lXOq_8IZR08PzaYMUojgucT_wMoHhOo4q8rVjjn0%3D&attredirects=0"
        target="_blank"
        >Trần Văn Nghĩa</a
      >
    </div>
  </CFooter>
</template>

<script>
export default {
  name: 'AppFooter',
}
</script>
