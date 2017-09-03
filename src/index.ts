import './style/main.scss'
import * as Vue from 'vue'
import App from './App.vue'
import NoneSingleFile from './components/none-single-file'

Vue.component('my-component', NoneSingleFile)

new Vue({
    el: '#app',
    render: (h: any) => h(App),
});
