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
import { FlatList, View, Text, StyleSheet } from 'react-native'
import { connect } from 'react-redux'

// Selectors
import { messageHistory } from 'xdemic/lib/selectors/processStatus'

// Components
import MenuItem from 'xdemic/lib/components/shared/MenuItem'

// Utilities
import { colors } from 'xdemic/lib/styles/globalStyles'

class StatusMessages extends React.Component {

  static navigatorStyle = {
    largeTitle: false,
    navBarBackgroundColor: colors.brand,
    navBarButtonColor: colors.white,
    navBarTextColor: colors.white,
  }

  render() {
    return (
      <FlatList
        data={this.props.history}
        renderItem={({item}) => (
          <MenuItem
            title={item.section}
            danger={!!item.error}
            value={item.error || item.message}
            />
        )}
        keyExtractor={item => `msg-${item.section}-${item.type}-${item._time}`}
    />
    )
  }
}

const mapStateToProps = (state) => {
  return {
    history: messageHistory(state)
  }
}

export default connect(mapStateToProps)(StatusMessages)
