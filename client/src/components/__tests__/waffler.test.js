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
        expect(wrapper.state('ranks')['1']).toBe(0);
        expect(wrapper.state('pair').length).toBe(2);
        expect(wrapper.state('pair')[0]).not.toBe(wrapper.state('pair')[1]);
    });

    it('selecting restaurants', () => {
        var origPair = wrapper.state('pair');
        var selectedId = origPair[0].id; 
        var selectedRank = wrapper.state('ranks')[selectedId];
        var otherId = origPair[1].id;
        var otherRank = wrapper.state('ranks')[otherId];
        instance.selectRestaurant(origPair[0]);
        expect(wrapper.state('ranks')[selectedId]).toBeGreaterThan(selectedRank);
        expect(wrapper.state('ranks')[otherId]).toBeLessThan(otherRank);
    });

    it('removing restaurants', () => {
        var removed = restaurants[3];
        instance.removeRestaurant(restaurants[3]);
        expect(wrapper.state('restaurants').length).toBe(4);
        expect(wrapper.state('restaurants')[3].id).not.toBe(removed.id);
        expect(wrapper.state('ranks')['3']).toBe(undefined);
    });
});