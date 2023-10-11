import Handlebars from 'handlebars';
import { conditional, ternary } from './conditions';
import { includes, markdown, changelog } from './includes';
import { parseProperty } from './json';
import { createArray, createObject, createString } from './create';

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
