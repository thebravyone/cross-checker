/**
* @Author: Guilherme Serradilha
* @Date:   21-Jan-2017 0:25:07
* @Filename: renderer.js
* @Last modified by:   Guilherme Serradilha
* @Last modified time: 21-Jan-2017 18:17:53
* @License: MIT
*/

/* global angular */

const {dialog} = require('electron').remote
const fs = require('fs')
const path = require('path')

angular.module('App', ['ngMaterial'])
.config(function ($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('teal')
    .accentPalette('pink')
})
.controller('Ctrl', function ($scope, $timeout, $mdSidenav) {
  // List of filenames
  $scope.list = {
    name: '',
    array: []
  }

  // Search directory
  $scope.dir = ''

  // Console reference
  var consoleText = document.getElementById('console-text')

  // Browse file containing list of filenames
  $scope.BrowseFile = function () {
    $scope.list = getList(dialog.showOpenDialog({properties: ['openFile']})[0])
    console.log($scope.list.array)
  }

  // Browse directory to be searched
  $scope.BrowseFolder = function () {
    $scope.dir = dialog.showOpenDialog({properties: ['openDirectory']})[0]
  }

  // Match list and directory
  $scope.Run = function () {
    if ($scope.list.array.length === 0 || $scope.dir === '') {
      addConsoleLine('<p class="cl-error">ERROR: select list AND directory before running.</p>')
    } else {
      addConsoleLine('<p class="cl-action">searching filenames @ ' + $scope.dir + '</p>')

      var liArray = $scope.list.array
      var drArray = fs.readdirSync($scope.dir)
      var matches = 0

      var cross = function (index) {
        for (var d = 0; d < drArray.length; d++) {
          if (liArray[index] === drArray[d]) {
            return true
          }
        }
        return false
      }

      for (var i = 0; i < liArray.length; i++) {
        if (cross(i)) {
          matches++
        } else {
          addConsoleLine('<div><span class="cl-error">' + liArray[i] + '</span> was not found.</div>')
        }
      }

      addConsoleLine('<p class="cl-warning">' + matches + '/' + liArray.length + ' matches.</p>')
    }
  }

  // Build list object from file
  function getList (file) {
    return {
      name: path.basename(file),
      array: fs.readFileSync(file, 'utf8').split('\r\n')
    }
  }

  // Add a new line to console screen and scroll to its position
  function addConsoleLine (html) {
    consoleText.insertAdjacentHTML('beforeend', html)
    $timeout(function () {
      consoleText.scrollTop = consoleText.scrollHeight
    }, 0, false)
  }
})
