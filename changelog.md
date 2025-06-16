# Changelog

All notable changes to the Opportunity Cost extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.5] - 2025-06-16

### Removed

- BTC denominated rounding - removed rounding logic for BTC values to provide more precise bitcoin conversions

## [0.0.4] - 2025-06-12

### Added

- Abbreviated sats display for large satoshi values ≥10,000 sats (e.g. 10.5k sats instead of 10,505 sats)
- Support for processing composite price elements that split currency symbols and numeric values across sibling nodes for more accurate price conversions
- Currency selector in extension popup - users can now change their default currency directly from the popup interface
- Added support for 20 additional currencies: Mexican Peso (MXN), Argentine Peso (ARS), Philippine Peso (PHP), Vietnamese Dong (VND), Indonesian Rupiah (IDR), Brazilian Real (BRL), Chilean Peso (CLP), South African Rand (ZAR), Russian Ruble (RUB), South Korean Won (KRW), Hong Kong Dollar (HKD), New Taiwan Dollar (TWD), Hungarian Forint (HUF), Danish Krone (DKK), New Zealand Dollar (NZD), Turkish Lira (TRY), Polish Złoty (PLN), Czech Koruna (CZK), Swedish Krona (SEK), and Norwegian Krone (NOK)

### Fixed

- Improved number parsing to correctly handle Dutch-style prices with periods as thousands separators and commas as decimal separators (e.g., €1.425.000 and €2.999,99)

## [0.0.3] - 2025-06-01

### Added

- Site-specific toggle functionality - users can now disable the extension on specific websites
- Firefox extension support - the extension is now compatible with Firefox browsers
- Real-time preference updates - changes to settings apply immediately without requiring page reloads

### Changed

- Improved user experience when updating preferences - no longer reloads all browser tabs
- Optimized tab messaging to only update the current active tab instead of all open tabs

### Removed

- Site statistics section from the options page for cleaner interface

---

## [Unreleased]

### Added

### Changed

### Deprecated

### Removed

### Fixed

### Security
