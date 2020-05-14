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

import { Location } from '../catalog';
import { ParserOutput } from '../descriptors';
import { FileLocationReader, LocationReader } from './model';

// Registry of all readers
const readers: LocationReader[] = [new FileLocationReader()];

/**
 * Reads the contents of a single location and responds with all its parsed contents.
 *
 * @param location The location to read
 * @returns The parsed contents
 * @throws An error if the location as a whole could not be read
 */
export async function readLocation(location: Location): Promise<ParserOutput> {
  const reader = readers.find((r) => r.type === location.type);
  if (!reader) {
    throw new Error(`Unknown location type ${location.type}`);
  }

  return reader.read(location.target);
}
