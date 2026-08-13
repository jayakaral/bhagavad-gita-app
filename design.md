# Bhagavad Gita Mobile Interface Design

## Product Direction

Bhagavad Gita is a calm, bilingual scripture reader designed for brief daily study and sustained chapter reading. The interface is optimized for portrait phones and one-handed use: the primary navigation sits in a bottom tab bar, the current reading is always reachable from the home screen, and chapter/verse controls remain near the thumb zone.

## Screen List and Layout

| Screen | Primary content and functionality | Portrait layout |
|---|---|---|
| Home | Daily welcome, continue-reading card, a featured teaching, language preference, and chapter entry point. | Warm header; large continue-reading card; concise cards stacked vertically. |
| Chapters | All 18 chapters with number, Sanskrit title, English title, Hindi title, and verse count. | Searchable list with compact chapter cards and a leading chapter numeral. |
| Reader | Chapter title, language switch, verse cards, verse navigation, saved indicator, and display controls. | Fixed compact chapter header; vertically scrollable verses; readable typography with generous line height. |
| Saved | Locally saved verses with references and excerpted translations. | Empty state or reverse-chronological saved verse list. |
| Settings | Reading language, font size, and theme preference. | Simple iOS-style grouped settings cards. |

## Key User Flows

| Goal | Flow |
|---|---|
| Start a reading session | Home → Continue reading → Reader opens at the last visited chapter and verse. |
| Browse a chapter | Chapters → Tap a chapter card → Reader loads that chapter in the selected language. |
| Change language | Reader → Language segmented control → Verse translation updates while the chapter reference remains unchanged. |
| Save a teaching | Reader → Tap bookmark on a verse → Local saved collection updates → Saved tab displays the verse. |
| Resume a saved passage | Saved → Tap saved verse → Reader opens the matching chapter and verse. |

## Visual System

The app uses an unhurried devotional palette rather than ornate religious imagery. **Saffron #C56A16** is the action and focus color, **deep indigo #17243C** anchors titles and navigation, **parchment #FBF7EE** softens the reading surface, and **marigold #E6A22D** provides a restrained highlight. Dark mode uses charcoal-indigo #131A2B with warm cream text #F7F0E1. Cards have 18–24 px corner radii, 1 px low-contrast borders, and subtle elevation. Typography prioritizes clear Latin and Devanagari rendering with large, comfortable verse text.

## Interaction Standards

Tap targets are at least 44 pt. List rows use soft opacity feedback, while bookmark and reading controls use light haptic confirmation. The reader avoids distracting animation; only compact transitions and state changes are used. No account or cloud sync is required—the app keeps reading progress, preferences, and saved verses on the device.
