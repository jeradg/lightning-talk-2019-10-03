import FakeXMLHttpRequest from '../node_modules/fake-xml-http-request/src/fake-xml-http-request.js';
import '../node_modules/whatwg-fetch/fetch.js';
import RouteRecognizer from '../node_modules/route-recognizer/dist/route-recognizer.es.js';

export default function setupTests(context) {
  context.FakeXMLHttpRequest = FakeXMLHttpRequest;
  context.RouteRecognizer = RouteRecognizer;
}
