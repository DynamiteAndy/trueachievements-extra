import Handlebars from 'handlebars';
import { conditional, ternary } from './conditions.ts';
import { includes, markdown, changelog } from './includes.ts';
import { parseProperty } from './json.ts';
import { createArray, createObject, createString } from './create.ts';

changelog();
markdown();
includes();
parseProperty();
createObject();
createArray();
createString();
conditional();
ternary();

export default Handlebars;
