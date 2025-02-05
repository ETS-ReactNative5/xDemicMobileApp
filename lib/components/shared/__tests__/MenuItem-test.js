// Copyright (C) 2019 Hoola Inc
//
// This file is part of xDemic Mobile App.
//
// xDemic Mobile App is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// xDemic Mobile App is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with xDemic Mobile App.  If not, see <http://www.gnu.org/licenses/>.
//
/* globals it, expect */
import 'react-native'
import React from 'react'
import MenuItem from '../MenuItem'
import renderer from 'react-test-renderer'

it('renders MenuItem with title', () => {
  const tree = renderer.create(
    <MenuItem title='hello' />
  ).toJSON()
  expect(tree).toMatchSnapshot()
})

it('renders MenuItem with title and value', () => {
  const tree = renderer.create(
    <MenuItem title='hello' value='stuff' />
  ).toJSON()
  expect(tree).toMatchSnapshot()
})

it('renders MenuItem with title, value and link', () => {
  const tree = renderer.create(
    <MenuItem title='hello' value='stuff' href='http://demo.uport.me' />
  ).toJSON()
  expect(tree).toMatchSnapshot()
})

it('renders MenuItem with title, value and internal link', () => {
  const tree = renderer.create(
    <MenuItem title='hello' value='stuff' navigator={{}} destination='uport.settings' />
  ).toJSON()
  expect(tree).toMatchSnapshot()
})

it('renders MenuItem with title, value and onPress', () => {
  const tree = renderer.create(
    <MenuItem title='hello' value='stuff' onPress={() => console.log('hello')} />
  ).toJSON()
  expect(tree).toMatchSnapshot()
})

it('renders MenuItem with title and link', () => {
  const tree = renderer.create(
    <MenuItem title='hello' href='http://demo.uport.me' />
  ).toJSON()
  expect(tree).toMatchSnapshot()
})

it('renders MenuItem with title and internal link', () => {
  const tree = renderer.create(
    <MenuItem title='hello' navigator={{}} destination='uport.settings' />
  ).toJSON()
  expect(tree).toMatchSnapshot()
})

it('renders MenuItem with title and onPress', () => {
  const tree = renderer.create(
    <MenuItem title='hello' onPress={() => console.log('hello')} />
  ).toJSON()
  expect(tree).toMatchSnapshot()
})
