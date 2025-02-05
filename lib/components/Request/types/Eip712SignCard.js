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
import { StyleSheet, Text, View, ScrollView, Linking, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import InteractionStats from '../partials/InteractionStats'
import DataFlowHeader from '../partials/DataFlowHeader'
import RequestItem, { RequestItemList } from '../partials/RequestItem'
import { AcceptCancelGroup } from 'xdemic/lib/components/shared/Button'
import NestedInfo from 'xdemic/lib/components/shared/NestedInfo'
import Status from 'xdemic/lib/components/shared/Status'

// Selectors
import { clientProfile, currentRequest } from 'xdemic/lib/selectors/requests'
import { publicUport, currentAddress, interactionStats, hasPublishedDID } from 'xdemic/lib/selectors/identities'
import { working, errorMessage } from 'xdemic/lib/selectors/processStatus'
import { endpointArn } from 'xdemic/lib/selectors/snsRegistrationStatus'

import { toJs, get } from 'mori'
import verifiedByUport from 'xdemic/lib/utilities/verifiedByUport'
import { networks, defaultNetworkId } from 'xdemic/lib/utilities/networks'

// Actions
import { authorizeRequest, cancelRequest, clearRequest } from 'xdemic/lib/actions/requestActions'

// Styles
import { textStyles, colors } from 'xdemic/lib/styles/globalStyles'

const styles = StyleSheet.create({
  titleContainer: {
    marginBottom: 18,
    marginTop: 18,
  },
  url: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 5,
    paddingBottom: 5,
  },
})

export const Eip712SignCard = props => {
  const showUrl = props.client && props.client.url !== undefined
  return (
    <View style={{ alignItems: 'stretch', flex: 1 }}>
      <DataFlowHeader sender={props.currentIdentity} recipient={props.client} verified={props.uportVerified} />
      {/* Request Hero */}
      <View style={styles.titleContainer}>
        <Text style={textStyles.h2}>
          {props.client && props.client.name ? props.client.name : 'This unidentified dApp'}
        </Text>
        {showUrl && (
          <View style={styles.url}>
            <TouchableOpacity onPress={() => Linking.openURL(props.client.url)}>
              <Text style={{ color: colors.purple }}>{props.client.url}</Text>
            </TouchableOpacity>
          </View>
        )}
        <Text style={textStyles.p}>
          {!props.authorized ? 'is requesting you to sign this information' : 'requested you to sign this information'}
        </Text>
      </View>
      <NestedInfo
        componentId={props.componentId}
        data={props.subject ? { subject: props.subject, ' ': props.unsignedClaim } : props.unsignedClaim}
      />
      <InteractionStats stats={props.interactionStats} actionText='shared your details' counterParty={props.client} />
      {props.unpublished ? <Status process='persona' /> : null}

      {props.createSubAccount ? <Status process='createSubAccount' /> : null}

      {props.error ? <Text style={[textStyles.small, { color: 'red' }]}>{props.error}</Text> : null}
      {!props.authorized ? (
        <AcceptCancelGroup
          disabled={props.pushWorking || props.unpublished || !!props.error || props.createSubAccount}
          acceptText='Sign'
          cancelText='Cancel'
          onAccept={() => props.authorizeRequest(props.requestId)}
          onCancel={() => props.cancelRequest(props.requestId)}
        />
      ) : (
        <View />
      )}
    </View>
  )
}

Eip712SignCard.propTypes = {
  requestId: PropTypes.string,
  pushPermissions: PropTypes.bool,
  network: PropTypes.string,
  actType: PropTypes.string,
  authorized: PropTypes.bool,
  verified: PropTypes.object,
  currentIdentity: PropTypes.object,
  client: PropTypes.object,

  authorizeRequest: PropTypes.func,
  cancelRequest: PropTypes.func,
  clearRequest: PropTypes.func,
}

const mapStateToProps = state => {
  const request = currentRequest(state) || {}
  const address = request.target || currentAddress(state)
  const account = request.account
  const network = networks[request.network] || { network_id: request.network, name: request.network }
  const networkName = network.name
  const client = clientProfile(state)
  const currentIdentity = toJs(publicUport(state))
  const unsignedClaim = request && request.typedData ? request.typedData : {}
  const subject = request && request.subject ? request.subject : ''
  const uportVerified =
    request && request.client_id ? Object.keys(verifiedByUport).indexOf(request.client_id) > -1 : false
  const pushWorking = working(state, 'push')
  const pushError = errorMessage(state, 'push')
  const createSubAccount = working(state, 'createSubAccount')
  let stats
  let shareStats
  if (request) {
    stats = toJs(get(interactionStats(state), request.client_id)) || 0
    // console.log(stats)
    shareStats = { shared: stats.share || 0 }
  }
  return {
    currentIdentity,
    client,
    account,
    network: request.network,
    networkName,
    actType: request.actType,
    unpublished: !hasPublishedDID(state, address),
    requestId: request.id,
    error: (request || {}).error,
    pushPermissions: !!request.pushPermissions,
    authorized: !!request.authorizedAt,
    pushWorking,
    createSubAccount,
    pushError,
    unsignedClaim,
    uportVerified,
    subject,
    interactionStats: shareStats,
    snsRegistered: !!endpointArn(state),
  }
}

const mapDispatchToProps = dispatch => ({
  clearRequest: () => {
    dispatch(clearRequest())
  },
  authorizeRequest: activity => dispatch(authorizeRequest(activity)),
  cancelRequest: activity => dispatch(cancelRequest(activity)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Eip712SignCard)
