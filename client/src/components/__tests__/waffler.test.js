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
            new Restaurant('4', 'Starbucks', 3, 4.5, ''),
            new Restaurant('5', 'Cold Stone', 3, 4.5, '')
        ];

        wrapper = shallow(<Waffler />);
        instance = wrapper.instance();
        instance.setInitial(restaurants);
    });

    it('setting up restaurants', () => {
        expect(wrapper.state('unvisited').length).toBe(4);
        expect(wrapper.state('visited').length).toBe(2);
        expect(wrapper.state('ranks')['1']).toBe(0);
        expect(wrapper.state('pair').length).toBe(2);
        expect(wrapper.state('pair')[0]).not.toBe(wrapper.state('pair')[1]);
    });

    it('getting first 3 pairs', () => {
        expect(wrapper.state('unvisited').length).toBe(4);
        expect(wrapper.state('visited').length).toBe(2);
        for (var i = 0; i < 2; i++) {
            instance.getNewPair();
        }
        expect(wrapper.state('unvisited').length).toBe(0);
        expect(wrapper.state('visited').length).toBe(6);
    });

    it('getting new ranks', () => {
        var pair = wrapper.state('pair');
        var selectedId = pair[0].id;
        var selectedRankBefore = wrapper.state('ranks')[selectedId];
        var unselectedId = pair[1].id;
        var unselectedRankBefore = wrapper.state('ranks')[unselectedId];

        instance.getNewRanks(selectedId, unselectedId);
        expect(wrapper.state('ranks')[selectedId]).toBeGreaterThan(selectedRankBefore);
        expect(wrapper.state('ranks')[unselectedId]).toBeLessThan(unselectedRankBefore);
    });

    it('getting pairs after first 3', () => {
        for (var i = 0; i < 2; i++) {
            instance.getNewPair();
        }

        for (var i = 0; i < 10; i++) {
            var origPair = wrapper.state('pair');
            instance.getNewPair();
            expect(wrapper.state('pair')[0]).not.toBe(origPair[0]);
            expect(wrapper.state('pair')[1]).not.toBe(origPair[1]);
        }
    });

    it('selecting restaurants', () => {
        var origPair = wrapper.state('pair');

        var selectedId = origPair[0].id; 
        var selectedRank = wrapper.state('ranks')[selectedId];

        var otherId = origPair[1].id;
        var otherRank = wrapper.state('ranks')[otherId];

        instance.selectRestaurant(origPair[0]);
        expect(wrapper.state('unvisited').length).toBe(2);
        expect(wrapper.state('visited').length).toBe(4);
        expect(wrapper.state('ranks')[selectedId]).toBeGreaterThan(selectedRank);
        expect(wrapper.state('ranks')[otherId]).toBeLessThan(otherRank);
    });
});