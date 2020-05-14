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

import yaml from 'yaml';
import { ComponentDescriptorV1Parser } from './model/ComponentDescriptorV1';
import { parseDescriptorEnvelope } from './model/envelope';
import { DescriptorParser, ParserOutput } from './types';

// Registry of parsers for all versions/kinds
const parsers: DescriptorParser[] = [new ComponentDescriptorV1Parser()];

/**
 * Parses some raw YAML data, and validates and extracts all items in it.
 *
 * @param data The textual contents of a YAML format file
 * @throws An Error if the entire file could not be parsed
 */
export async function parseDescriptorYaml(data: string): Promise<ParserOutput> {
  let documents;
  try {
    documents = yaml.parseAllDocuments(data);
  } catch (e) {
    throw new Error(`Could not parse YAML data, ${e}`);
  }

  const result: ParserOutput = {
    errors: [],
    components: [],
  };

  for (const document of documents) {
    if (!document.contents) {
      continue;
    }

    if (document.errors?.length) {
      result.errors.push(
        new Error(`Malformed YAML document, ${document.errors[0]}`),
      );
      continue;
    }

    try {
      const envelope = await parseDescriptorEnvelope(document.toJSON());
      const parser = parsers.find(
        (p) => p.apiVersion === envelope.apiVersion && p.kind === envelope.kind,
      );
      if (!parser) {
        throw new Error(
          `Unsupported object ${envelope.apiVersion}, ${envelope.kind}`,
        );
      }
      const parsed = await parser.parse(envelope);

      parsed.errors.forEach((e) => result.errors.push(e));
      parsed.components.forEach((c) => result.components.push(c));
    } catch (e) {
      result.errors.push(e);
      continue;
    }
  }

  return result;
}
