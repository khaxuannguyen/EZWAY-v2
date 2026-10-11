import test from 'node:test';import assert from 'node:assert/strict';
import {shipmentRoute} from '../lib/tracking-route.ts';
test('origin customs scan does not replace the real destination',()=>{const data={route:'VIETNAM → CANADA',country:'CANADA',timeline:[{location:'HO CHI MINH, VN'}]};assert.equal(shipmentRoute(data),'Việt Nam → CANADA');assert.equal(shipmentRoute({country:'CA'}),'Việt Nam → Canada');assert.equal(shipmentRoute({}),'Tuyến vận chuyển đang cập nhật');});
