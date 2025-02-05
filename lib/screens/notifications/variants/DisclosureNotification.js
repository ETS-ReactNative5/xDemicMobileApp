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
import React from "react";
// Components
import Notification from "../Notification";

const DisclosureNotification = props => {
  const client = props.issuer(props.activity.client_id);
  const clientName = client ? client.name : "Unknown dApp";
  const requested = props.requested(props.activity);
  const requestedText = requested
    ? `, ${Object.keys(requested).join(", ")}`
    : "";
  const handleAuthorize = () => {
    props.authorize(props.activity);
  };
  const handleCancel = () => {
    props.cancel(props.activity);
  };
  return (
    <Notification
      title="Share Requests"
      cancelText="Reject"
      acceptText="Share"
      cardPress={() => props.selectRequest(props.activity)}
      name={clientName}
      avatar={
        client
          ? client.avatar
            ? client.avatar
            : { name: clientName, address: client.address }
          : null
      }
      type={
        client
          ? typeof client.type === "undefined"
            ? "CONTRACT"
            : client.type.toUpperCase()
          : "CONTRACT"
      }
      date={
        typeof props.activity.authorizedAt === "undefined"
          ? 0
          : props.activity.authorizedAt
      }
      line1={
        props.activity.canceledAt
          ? `Transaction Canceled`
          : props.activity.authorizedAt
          ? `You shared with ${clientName}`
          : `${clientName} requested`
      }
      line2={
        props.activity.canceledAt ? `` : `Your public xdemic${requestedText}`
      }
      completed={props.activity.authorizedAt}
      canceled={props.activity.canceledAt}
      cancel={handleCancel}
      accept={handleAuthorize}
      noButtons={props.noButtons || false}
    />
  );
};

export default DisclosureNotification;
