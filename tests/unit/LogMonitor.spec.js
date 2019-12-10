import LogMonitor from '@/components/LogMonitor.vue'
import Vue from 'vue';
import Vuetify from 'vuetify';

// Utilities
import {
  mount,
  createLocalVue
} from '@vue/test-utils'
Vue.use(Vuetify);

const localVue = createLocalVue()

describe('LogMonitor.vue', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  it('should have a default content and match snapshot', () => {
    const wrapper = mount(LogMonitor, {
      localVue,
      vuetify,
    })

    // With jest we can create snapshot files of the HTML output
    expect(wrapper.html()).toMatchSnapshot()
  })
})
