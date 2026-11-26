// What makes a round fair to ask: the place the question points at must be the place the answer is scored at.
// Atlas scores a guess against the place its record is tied to. Most of the museum's events are tied to the place
// they happened; some are tied to the nearest city instead. Where the event's own name says where it happened
// ("Battle of X") and that is somewhere else, a player who knows the answer is marked wrong for it.

/** A label that says where a thing happened: "Battle of X", "Siege of X", "Treaty of X". Read in English, which every round has. */
const NAMED_FOR_A_PLACE = /^(?:The )?(?:First |Second |Third |Fourth |Great )?(?:Battle|Siege|Sack|Conquest|Capture|Fall|Treaty|Peace|Council|Massacre|Raid|Expedition|Relief|Defence|Defense|Burning|Bombardment|Occupation|Surrender|Revolt|Uprising|Founding|Foundation) (?:of|at|near) /i;

export const namedForAPlace = (englishLabel: string): boolean => NAMED_FOR_A_PLACE.test(englishLabel);

/**
 * True for a round that must be held back: it is named for a place, and none of its labels, in any language, gives
 * the name of the place it would be scored at. It may be a different place, or the same place under a name the
 * museum does not have; either way it is for a reader of the record to say, and until then it is not asked.
 */
export const heldForItsPlace = (englishLabel: string, someLabelNamesThePlace: boolean): boolean => !someLabelNamesThePlace && namedForAPlace(englishLabel);
