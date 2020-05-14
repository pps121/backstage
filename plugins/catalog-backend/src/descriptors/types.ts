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

import { ComponentDescriptorV1 } from './model/ComponentDescriptorV1';

export type ComponentDescriptor = ComponentDescriptorV1;

export type DescriptorEnvelope = {
  apiVersion: string;
  kind: string;
  metadata?: object;
  spec?: object;
};

export type DescriptorParser = {
  apiVersion: string;
  kind: string;
  parse(envelope: DescriptorEnvelope): Promise<ParserOutput>;
};

export type ParserOutput = {
  errors: Error[];
  components: ComponentDescriptor[];
};
