# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),

## [unreleased]

### Added

- You can now login with your Gitlab account
- Removed the 50 latest notifications limit, you can now see all your notifications

### Changes

- Small performance improvements

### Fixed

- Fixed a layout shift in the inbox when a notification is viewed

## [2.0.0] - 2022-10-23

### Changes

- Ping for Gitlab now runs on a completely new infrastructure allowing for more reliability and better performance

## [1.2.1] - 2022-08-27

### Added

- Added image to the landing page

### Changes

- Ping for Gitlab is evolving, with this release we allow users to migrate their anonymous and permanent accounts to the new infrastructure, which will be introduced in the next major release
- Links in notifications now open on external browser

## [1.2.0] - 2022-07-06

### Added

- Pause notifications from app settings
- App code is now open source!

## [1.1.1] - 2022-06-15

### Added

- User account deletion

### Fixed

- Notifications dates older than a month not displayed correctly
- Logging out from the device won't stop notifications from coming in
- Going back to the landing page on onboarding after creating a new account with credentials deletes it

## [1.1.0] - 2022-05-31

### Added

- Support for dark mode

## [1.0.2] - 2022-05-26

### Changes

- Improvements to auth forms
- Only load 50 notifications in inbox

### Fixed

- Skeleton loading bug on Inbox

## [1.0.1] - 2022-05-22

### Added

- When a notification is received with the app in the foreground a toast is displayed

### Fixed

- App Badge now resets on open
- If you are on the "Get Started" page now you can go back to the landing page

## 1.0.0 - 2022-05-06

### Added

- First release on the stores

[unreleased]: https://github.com/zaniluca/ping-4-gitlab/compare/v2.0.0...HEAD
[1.0.1]: https://github.com/zaniluca/ping-4-gitlab/releases/tag/v1.0.1
[1.0.2]: https://github.com/zaniluca/ping-4-gitlab/releases/tag/v1.0.2
[1.1.0]: https://github.com/zaniluca/ping-4-gitlab/releases/tag/v1.1.0
[1.1.1]: https://github.com/zaniluca/ping-4-gitlab/releases/tag/v1.1.1
[1.2.0]: https://github.com/zaniluca/ping-4-gitlab/releases/tag/v1.2.0
[1.2.1]: https://github.com/zaniluca/ping-4-gitlab/releases/tag/v1.2.1
[2.0.0]: https://github.com/zaniluca/ping-4-gitlab/releases/tag/v2.0.0
