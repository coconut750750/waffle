import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure } from 'enzyme';

import Waffler from '../Waffler.jsx'

configure({adapter: new Adapter()});

describe('Waffler', () => {
  it('selecting restaurants', () => {
    const wrapper = shallow(<Waffler />);
    const instance = wrapper.instance();

    console.log(wrapper.state('restaurants'));
    // expect(wrapper.state('counter')).toBe(0);
    // instance.incrementCounter();
    // expect(wrapper.state('counter')).toBe(1);
  });
});