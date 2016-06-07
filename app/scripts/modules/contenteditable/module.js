import angular from 'angular';
import { contenteditable } from './directives/contenteditable';

export default angular
    .module('contenteditable', [])

    .directive('contenteditable', ['$parse', contenteditable]);
