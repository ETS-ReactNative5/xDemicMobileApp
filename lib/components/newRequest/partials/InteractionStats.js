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
// Frameworks
import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, Text, View } from 'react-native'
import { font } from 'xdemic/lib/styles/globalStyles'

const styles = StyleSheet.create({
  interactionText: {
    color: 'rgba(138,155,161,1.0)',
    fontFamily: font,
    fontSize: 13,
  }
})

const StatsSection = (props) => (
  <View style={[{
    flexDirection: 'row',
    alignItems: 'center'
  }, props.style]}>
    {props.children}
  </View>
)

const InteractionStats = (props) => {
  // console.log(props.stats)
  const interactionValue = (() => {
    let total = 0
    typeof props.stats === 'object' ? Object.keys(props.stats).forEach((value) => (value !== 'request' ? total += props.stats[value] : null)) : null
    return total
  })()

  // if (!props.counterParty) return (<View />)
  const name = props.counterParty
    ? (props.counterParty.name ? props.counterParty.name : (props.counterParty.address ? ('' + props.counterParty.address).slice(0, 12) : 'Unknown'))
    : 'this dApp'

  return (<StatsSection style={props.style}>
    <View style={{marginTop: 16, marginBottom: 16}}>
      {interactionValue === 0 || !props.stats
        ? <Text style={[styles.interactionText, {color: props.color ? props.color : 'rgba(138,155,161,1.0)'}]}>You have never {props.actionText} with {name}</Text>
      : (<Text style={[styles.interactionText, {color: props.color ? props.color : 'rgba(138,155,161,1.0)'}]}>You've {props.actionText} with {name}
        <Text style={[styles.interactionText, {color: props.color ? props.color : 'rgba(138,155,161,1.0)'}]}>
          { interactionValue === 1
            ? ' once '
            : ` ${interactionValue} times `}
        </Text>
      </Text>)
      }
    </View>
  </StatsSection>)
}

InteractionStats.propTypes = {
  actionText: PropTypes.string,
  counterParty: PropTypes.object,
  color: PropTypes.string
}

export default InteractionStats
