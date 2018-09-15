import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure } from 'enzyme';

import Waffler from '../Waffler.jsx'
import Restaurant from '../../restaurant.js'

configure({adapter: new Adapter()});

function visitN(instance, wrapper, totalPairs) {
    for (var i = 0; i < totalPairs - 1; i++) {
        instance.handleSelect(wrapper.state('pair')[0]);
    }
}

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

        wrapper = shallow(<Waffler.WrappedComponent city="san francisco"/>);
        instance = wrapper.instance();
        instance.setInitial(restaurants);
    });

    it('setting up restaurants', () => {
        expect(instance.unvisited.length).toBe(4);
        expect(restaurants[1].rank).toBe(1000);
        expect(wrapper.state('pair').length).toBe(2);
        expect(wrapper.state('pair')[0]).not.toBe(wrapper.state('pair')[1]);
    });

    it('getting first three pairs', () => {
        var origPair = wrapper.state('pair');
        instance.handleSelect(origPair[0]);
        expect(instance.unvisited.length).toBe(2);
        expect(instance.winners.length).toBe(1);
        expect(instance.losers.length).toBe(1);

        origPair = wrapper.state('pair');
        instance.handleSelect(origPair[0]);
        expect(instance.unvisited.length).toBe(0);
        expect(instance.winners.length).toBe(2);
        expect(instance.losers.length).toBe(2);

        origPair = wrapper.state('pair');
        instance.handleSelect(origPair[0]);
        expect(instance.unvisited.length).toBe(2);
        expect(instance.winners.length).toBe(0);
        expect(instance.losers.length).toBe(2);
    });

    it('getting new ranks', () => {
        var pair = wrapper.state('pair');
        var selected = pair[0];
        var selectedRankBefore = selected.rank;
        var unselected = pair[1];
        var unselectedRankBefore = unselected.rank;

        instance.setNewRanks(selected, unselected);
        expect(selected.rank).toBeGreaterThan(selectedRankBefore);
        expect(unselected.rank).toBeLessThan(unselectedRankBefore);
    });

    it('getting pairs after first 3', () => {
        visitN(instance, wrapper, 3);
        expect(instance.unvisited.length).toBe(0);
        expect(instance.winners.length).toBe(2);
        expect(instance.losers.length).toBe(2);

        var origPair = wrapper.state('pair');
        instance.handleSelect(origPair[0]);
        expect(instance.unvisited.length).toBe(2);
        expect(instance.winners.length).toBe(0);
        expect(instance.losers.length).toBe(2);

        expect(wrapper.state('pair')[0]).not.toBe(origPair[0]);
        expect(wrapper.state('pair')[1]).not.toBe(origPair[1]);
    });

    it('selecting restaurants', () => {
        var origPair = wrapper.state('pair');

        var selectedRank = origPair[0].rank;
        var otherRank = origPair[1].rank;

        instance.selectRestaurant(origPair[0]);
        expect(instance.unvisited.length).toBe(4);
        expect(origPair[0].rank).toBeGreaterThan(selectedRank);
        expect(origPair[1].rank).toBeLessThan(otherRank);
    });
});