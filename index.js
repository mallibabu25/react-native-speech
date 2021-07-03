import React from 'react';
import { NativeModules, NativeEventEmitter, Platform } from 'react-native';

const SpeechModule = NativeModules.SpeechModule;

const speechEmitter =
  Platform.OS !== 'web' ? new NativeEventEmitter(SpeechModule) : null;

class RNSpeech {
  _loaded = false;
  _listeners = null;
  _events = {};

  constructor() {
    this._loaded = false;
    this._listeners = null;
    this._events = {
      onSpeechStart: () => {},
      onSpeechEnd: () => {},
      onSpeechResults: () => {},
      onSpeechPartialResults: () => {},
    };
  }

  removeAllListeners() {
    SpeechModule.onSpeechStart = undefined;
    SpeechModule.onSpeechEnd = undefined;
    SpeechModule.onSpeechResults = undefined;
    SpeechModule.onSpeechPartialResults = undefined;
  }

  stop() {
    if (!this._loaded && !this._listeners) {
      return Promise.resolve();
    }
    return new Promise((resolve, reject) => {
      SpeechModule.stopSpeech((error) => {
        if (error) {
          reject(new Error(error));
        } else {
          resolve();
        }
      });
    });
  }
  start(word, grammar) {
    if (!this._loaded && !this._listeners && speechEmitter !== null) {
      this._listeners = Object.keys(this._events).map((key) =>
        speechEmitter.addListener(key, this._events[key])
      );
    }

    return new Promise((resolve, reject) => {
      const callback = (error) => {
        if (error) {
          reject(new Error(error));
        } else {
          resolve();
        }
      };
      if (Platform.OS === 'android') {
        SpeechModule.startListening(word, grammar, callback);
        setTimeout(function () {
          SpeechModule.stopSpeech((error) => {
            if (error) {
              reject(new Error(error));
            } else {
              resolve();
            }
          });
        }, 5000);
      }
    });
  }

  set onSpeechStart(fn) {
    this._events.onSpeechStart = fn;
  }

  set onSpeechEnd(fn) {
    this._events.onSpeechEnd = fn;
  }

  set onSpeechResults(fn) {
    this._events.onSpeechResults = fn;
  }
  set onSpeechPartialResults(fn) {
    this._events.onSpeechPartialResults = fn;
  }
}

export default new RNSpeech();
