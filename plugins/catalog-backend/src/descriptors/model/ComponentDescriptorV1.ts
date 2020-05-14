/*
 * Copyright 2020 Spotify AB
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as yup from 'yup';
import { DescriptorEnvelope, DescriptorParser, ParserOutput } from '../types';

export type ComponentDescriptorV1 = {
  metadata: {
    name: string;
  };
  spec: {
    type: string;
  };
};

const schema: yup.Schema<ComponentDescriptorV1> = yup.object({
  metadata: yup.object({
    name: yup.string().required(),
  }),
  spec: yup.object({
    type: yup.string().required(),
  }),
});

export class ComponentDescriptorV1Parser implements DescriptorParser {
  public apiVersion = 'catalog.backstage.io/v1';
  public kind = 'Component';

  async parse(envelope: DescriptorEnvelope): Promise<ParserOutput> {
    let component;
    try {
      component = await schema.validate(envelope, { strict: true });
    } catch (e) {
      throw new Error(`Malformed component, ${e}`);
    }

    return {
      errors: [],
      components: [component],
    };
  }
}
