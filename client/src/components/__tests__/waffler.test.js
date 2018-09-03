import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure } from 'enzyme';

import Waffler from '../Waffler.jsx'
import Restaurant from '../../restaurant.js'

configure({adapter: new Adapter()});

describe('Waffler', () => {
    let restaurants;
    let wrapper;
    let instance;

    beforeEach(() => {
        restaurants = [
            new Restaurant('0', 'Cravings', 4, 3.5, ''),
            new Restaurant('1', 'Potbelly', 2, 4, ''),
            new Restaurant('2', 'Bangkok Thai', 3, 4.5, ''),
            new Restaurant('3', 'McDonalds', 2, 4, ''),
            new Restaurant('4', 'Starbucks', 3, 4.5, '')
        ];

        wrapper = shallow(<Waffler />);
        instance = wrapper.instance();
        instance.setInitial(restaurants);
    });

    it('setting up restaurants', () => {
        expect(wrapper.state('restaurants')[1].name).toBe('Potbelly');
        expect(wrapper.state('scores')['1']).toBe(0);
        expect(wrapper.state('pair').length).toBe(2);
        expect(wrapper.state('pair')[0]).not.toBe(wrapper.state('pair')[1]);
    });

    it('selecting restaurants', () => {
        var origPair = wrapper.state('pair');
        instance.selectRestaurant(restaurants[3]);
        expect(wrapper.state('scores')['3']).toBe(1);
        expect(wrapper.state('pair')[0].id).not.toBe(origPair[0].id);
        expect(wrapper.state('pair')[1].id).not.toBe(origPair[1].id);
    });
});