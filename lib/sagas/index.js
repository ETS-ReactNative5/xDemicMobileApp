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
import { all, put } from "redux-saga/effects";
import { saveError } from "../actions/processStatusActions";
import startupSaga from "./startupSaga";
import handleRequestSaga from "./requests";
import identitySaga from "./identitySaga";
import personaSaga from "./persona";
import unnuSaga from "./unnu";
import blockchainSaga from "./blockchain";
import networkState from "./networkState";
import notificationRegistrationSaga from "./notifications";
import recoverySaga from "./recoverySaga";
import stateSaver from "./stateSaver";
import encryptionSaga from "./encryption";
import pututuSaga from "./pututu";
import featureFlagsSaga from "./featureFlagsSaga";
import metricsSaga from "./metrics";
import keychainSaga from "./keychain";
import hubSaga from "./hubSaga";
import migrationsSaga from "./migrationsSaga";
import debugSaga from "./debugSaga";

export default function* rootSaga() {
  try {
    yield all([
      featureFlagsSaga(),

      metricsSaga(),
      startupSaga(),
      stateSaver(),
      identitySaga(),
      networkState(),
      handleRequestSaga(),
      personaSaga(),
      unnuSaga(),
      blockchainSaga(),
      notificationRegistrationSaga(),
      recoverySaga(),
      encryptionSaga(),
      pututuSaga(),
      keychainSaga(),
      hubSaga(),
      migrationsSaga(),
      debugSaga()
    ]);
  } catch (e) {
    console.log("ERROR IN SAGAS", e);
    let stack = "";
    if (e.stack) {
      stack = "\n" + e.stack.split("\n")[1];
    }
    yield put(saveError(e.name, e.message + stack));
  }
}
