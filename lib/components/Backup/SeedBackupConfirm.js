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
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { View, Platform, KeyboardAvoidingView, TouchableOpacity, Clipboard } from 'react-native'
import { Text, KeyboardAwareScrollView, Checkbox } from '../shared'
import { connectTheme, defaultTheme } from 'xdemic/lib/styles'
import { OnboardingButton } from '../shared/Button'
import { seedWords } from 'xdemic/lib/selectors/recovery'
import { colors } from 'xdemic/lib/styles/globalStyles'

import { cancelScheduledNotification } from 'xdemic/lib/actions/snsRegistrationActions'
import { seedConfirmed } from 'xdemic/lib/actions/HDWalletActions'
import { Navigation } from 'react-native-navigation'
import SCREENS from 'xdemic/lib/screens/Screens'

import _ from 'lodash'

export class SeedBackupConfirm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      enteredWords: [],
      randomSeedWords: _.shuffle(props.seedWords).map((string, key) => {
        return { string, key }
      }),
    }

    this.enterWord = this.enterWord.bind(this)
    this.confirmed = this.confirmed.bind(this)
  }

  enterWord(word) {
    const words = this.state.enteredWords
    words.push(word)
    this.setState({ enteredWords: words })
  }

  removeWord(word) {
    const words = this.state.enteredWords
    _.remove(words, a => a === word)
    this.setState({ enteredWords: words })
  }

  confirmed() {
    this.props.cancelScheduledNotification('recoveryNotification')
    this.props.seedConfirmed()

    Navigation.push(this.props.componentId, {
      component: {
        name: SCREENS.BACKUP.CreateSeedSuccess,
        options: {
          topBar: {
            visible: false,
          },
        },
      },
    })
  }

  render() {
    const { styles, colors } = this.context.theme ? this.context.theme : defaultTheme

    return (
      <View style={styles.container}>
        <KeyboardAwareScrollView overScrollMode='always'>
          <Text p>Please re-enter your seed phrase in order.</Text>

          <View style={styles.seedConfirmSelectedWordsWrapper}>
            {_.map(_.chunk(_.assign(_.fill(new Array(12), ''), this.state.enteredWords), 4), (chunk, chunkIdx) => (
              <View key={chunkIdx} style={styles.seedConfirmButtonRow}>
                {chunk.map((word, key) => (
                  <TouchableOpacity
                    key={key}
                    style={styles.column}
                    disabled={word === ''}
                    onPress={() => this.removeWord(word)}
                  >
                    <View style={[styles.seedConfirmButton, word === '' && styles.seedConfirmButtonEmpty]}>
                      <Text seedConfirmButtonLabel>{word ? word.string : ' '}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </View>

          <View style={styles.seedConfirmWrapper}>
            {_.map(_.chunk(this.state.randomSeedWords, 4), (chunk, chunkIdx) => (
              <View key={chunkIdx} style={styles.seedConfirmButtonRow}>
                {chunk.map((word, key) => (
                  <TouchableOpacity
                    key={key}
                    style={styles.column}
                    disabled={_.includes(this.state.enteredWords, word)}
                    onPress={() => this.enterWord(word)}
                  >
                    <View
                      style={[
                        styles.seedConfirmButton,
                        _.includes(this.state.enteredWords, word) && styles.seedConfirmButtonEmpty,
                      ]}
                    >
                      <Text seedConfirmButtonLabel>
                        {_.includes(this.state.enteredWords, word) ? ' ' : word.string}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </View>
        </KeyboardAwareScrollView>
        <OnboardingButton
          disabled={
            !_.isEqual(
              this.props.seedWords,
              _.reduce(
                this.state.enteredWords,
                (arr, word) => {
                  arr.push(word.string)
                  return arr
                },
                [],
              ),
            )
          }
          onPress={() => this.confirmed()}
        >
          {'Continue'}
        </OnboardingButton>
      </View>
    )
  }
}

SeedBackupConfirm.contextTypes = {
  theme: PropTypes.object,
}

const mapStateToProps = state => {
  return {
    seedWords: seedWords(state),
  }
}

export const mapDispatchToProps = dispatch => {
  return {
    cancelScheduledNotification: idString => {
      dispatch(cancelScheduledNotification(idString))
    },
    seedConfirmed: () => {
      dispatch(seedConfirmed())
    },
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SeedBackupConfirm)
