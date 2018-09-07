import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure } from 'enzyme';

import Waffler from '../Waffler.jsx'
import Restaurant from '../../restaurant.js'

configure({adapter: new Adapter()});

function visitN(instance, totalPairs) {
    for (var i = 0; i < totalPairs - 1; i++) {
        instance.updatePair();
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

        wrapper = shallow(<Waffler.WrappedComponent />);
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
        visitN(instance, 3);
        expect(wrapper.state('unvisited').length).toBe(0);
        expect(wrapper.state('visited').length).toBe(6);
    });

    it('getting new ranks', () => {
        var pair = wrapper.state('pair');
        var selected = pair[0];
        var selectedRankBefore = wrapper.state('ranks')[selected.id];
        var unselected = pair[1];
        var unselectedRankBefore = wrapper.state('ranks')[unselected.id];

        instance.setNewRanks(selected, unselected);
        expect(wrapper.state('ranks')[selected.id]).toBeGreaterThan(selectedRankBefore);
        expect(wrapper.state('ranks')[unselected.id]).toBeLessThan(unselectedRankBefore);
    });

    it('getting pairs after first 3', () => {
        visitN(instance, 3);

        var origPair = wrapper.state('pair');
        instance.updatePair();
        expect(wrapper.state('visited').length).toBe(2);
        expect(wrapper.state('unvisited').length).toBe(4);
        expect(wrapper.state('pair')[0]).not.toBe(origPair[0]);
        expect(wrapper.state('pair')[1]).not.toBe(origPair[1]);
    });

    it('selecting restaurants', () => {
        var origPair = wrapper.state('pair');

        var selectedId = origPair[0].id; 
        var selectedRank = wrapper.state('ranks')[selectedId];

        var otherId = origPair[1].id;
        var otherRank = wrapper.state('ranks')[otherId];

        instance.selectRestaurant(origPair[0]);
        expect(wrapper.state('unvisited').length).toBe(4);
        expect(wrapper.state('visited').length).toBe(2);
        expect(wrapper.state('ranks')[selectedId]).toBeGreaterThan(selectedRank);
        expect(wrapper.state('ranks')[otherId]).toBeLessThan(otherRank);
    });

    it('removing restaurants before all visited', () => {
        var toRemove = wrapper.state('pair')[0];
        instance.removeRestaurant(toRemove);

        expect(wrapper.state('visited').length).toBe(1);
        expect(wrapper.state('ranks')[toRemove.id]).toBe(undefined);
    });

    it('removing restaurants after all visited', () => {
        visitN(instance, 3);

        var toRemove = wrapper.state('pair')[0];
        instance.removeRestaurant(toRemove);

        expect(wrapper.state('removed')[0].id).toBe(toRemove.id);
        expect(wrapper.state('visited').length).toBe(5);
        expect(wrapper.state('ranks')[toRemove.id]).toBe(undefined);
    });

    it('removing restaurants multiple times', () => {
        var toRemove = wrapper.state('pair')[0];
        instance.removeRestaurant(toRemove);
        instance.removeRestaurant(toRemove);
        instance.removeRestaurant(toRemove);
        expect(wrapper.state('removed').length).toBe(1);
    });
});