//---------------------------------------------------------------------------//
// OWNER:	RAPID INSIGHT INC.												 //
// AUTHOR:  SCOTT STEESY													 //
// DATE:	01/23/2013														 //
// PURPOSE: Create a enum to emulate the TAB_COLLATION "named list" of		 //
//			constants in the Tableau Data Extract API.						 //
//---------------------------------------------------------------------------//

using System;
using API = Tableau.DataExtractAPI;

namespace Tableau
{
	public enum Collation
	{
		Collation_Binary = 0,		// Internal binary representation
		Collation_ar = 1,			// Arabic
		Collation_cs = 2,			// Czech
		Collation_cs_CI = 3,		// Czech (Case Insensitive)
		Collation_cs_CI_AI = 4,		// Czech (Case/Accent Insensitive
		Collation_da = 5,			// Danish
		Collation_de = 6,			// German
		Collation_el = 7,			// Greek
		Collation_en_GB = 8,		// English (Great Britain)
		Collation_en_US = 9,		// English (US)
		Collation_en_US_CI = 10,	// English (US, Case Insensitive)
		Collation_es = 11,			// Spanish
		Collation_es_CI_AI = 12,	// Spanish (Case/Accent Insensitive)
		Collation_et = 13,			// Estonian
		Collation_fi = 14,			// Finnish
		Collation_fr_CA = 15,		// French (Canada)
		Collation_fr_FR = 16,		// French (France)
		Collation_fr_FR_CI_AI = 17,	// French (France, Case/Accent Insensitive)
		Collation_he = 18,			// Hebrew
		Collation_hu = 19,			// Hungarian
		Collation_is = 20,			// Icelandic
		Collation_it = 21,			// Italian
		Collation_ja = 22,			// Japanese
		Collation_ja_JIS = 23,		// Japanese (JIS)
		Collation_ko = 24,			// Korean
		Collation_lt = 25,			// Lithuanian
		Collation_lv = 26,			// Latvian
		Collation_nl_NL = 27,		// Dutch (Netherlands)
		Collation_nn = 28,			// Norwegian
		Collation_pl = 29,			// Polish
		Collation_pt_BR = 30,		// Portuguese (Brazil)
		Collation_pt_BR_CI_AI = 31,	// Portuguese (Brazil Case/Accent Insensitive)
		Collation_pt_PT = 32,		// Portuguese (Portugal)
		Collation_root = 33,		// Root
		Collation_ru = 34,			// Russian
		Collation_sl = 35,			// Slovenian
		Collation_sv_FI = 36,		// Swedish (Finland)
		Collation_sv_SE = 37,		// Swedish (Sweden)
		Collation_tr = 38,			// Turkish
		Collation_uk = 39,			// Ukrainian
		Collation_vi = 40,			// Vietnamese
		Collation_zh_Hans_CN = 41,	// Chinese (Simplified, China)
		Collation_zh_Hant_TW = 42,	// Chinese (Traditional, Taiwan)
	}

	/// <summary>
	/// Safely convert between C# enum and Data Extract's exported constants
	/// </summary>
	internal static partial class ConvertEnum
	{
		public static Int32 ToCollation( Collation tc )
		{
			switch( tc )
			{
				case Collation.Collation_Binary:
					return( API.TAB_COLLATION_Binary );
				case Collation.Collation_ar:
					return( API.TAB_COLLATION_ar );
				case Collation.Collation_cs:
					return( API.TAB_COLLATION_cs );
				case Collation.Collation_cs_CI:
					return( API.TAB_COLLATION_cs_CI );
				case Collation.Collation_cs_CI_AI:
					return( API.TAB_COLLATION_cs_CI_AI );
				case Collation.Collation_da:
					return( API.TAB_COLLATION_da );
				case Collation.Collation_de:
					return( API.TAB_COLLATION_de );
				case Collation.Collation_el:
					return( API.TAB_COLLATION_el );
				case Collation.Collation_en_GB:
					return( API.TAB_COLLATION_en_GB );
				case Collation.Collation_en_US:
					return( API.TAB_COLLATION_en_US );
				case Collation.Collation_en_US_CI:
					return( API.TAB_COLLATION_en_US_CI );
				case Collation.Collation_es:
					return( API.TAB_COLLATION_es );
				case Collation.Collation_es_CI_AI:
					return( API.TAB_COLLATION_es_CI_AI );
				case Collation.Collation_et:
					return( API.TAB_COLLATION_et );
				case Collation.Collation_fi:
					return( API.TAB_COLLATION_fi );
				case Collation.Collation_fr_CA:
					return( API.TAB_COLLATION_fr_CA );
				case Collation.Collation_fr_FR:
					return( API.TAB_COLLATION_fr_FR );
				case Collation.Collation_fr_FR_CI_AI:
					return( API.TAB_COLLATION_fr_FR_CI_AI );
				case Collation.Collation_he:
					return( API.TAB_COLLATION_he );
				case Collation.Collation_hu:
					return( API.TAB_COLLATION_hu );
				case Collation.Collation_is:
					return( API.TAB_COLLATION_is );
				case Collation.Collation_it:
					return( API.TAB_COLLATION_it );
				case Collation.Collation_ja:
					return( API.TAB_COLLATION_ja );
				case Collation.Collation_ja_JIS:
					return( API.TAB_COLLATION_ja_JIS );
				case Collation.Collation_ko:
					return( API.TAB_COLLATION_ko );
				case Collation.Collation_lt:
					return( API.TAB_COLLATION_lt );
				case Collation.Collation_lv:
					return( API.TAB_COLLATION_lv );
				case Collation.Collation_nl_NL:
					return( API.TAB_COLLATION_nl_NL );
				case Collation.Collation_nn:
					return( API.TAB_COLLATION_nn );
				case Collation.Collation_pl:
					return( API.TAB_COLLATION_pl );
				case Collation.Collation_pt_BR:
					return( API.TAB_COLLATION_pt_BR );
				case Collation.Collation_pt_BR_CI_AI:
					return( API.TAB_COLLATION_pt_BR_CI_AI );
				case Collation.Collation_pt_PT:
					return( API.TAB_COLLATION_pt_PT );
				case Collation.Collation_root:
					return( API.TAB_COLLATION_root );
				case Collation.Collation_ru:
					return( API.TAB_COLLATION_ru );
				case Collation.Collation_sl:
					return( API.TAB_COLLATION_sl );
				case Collation.Collation_sv_FI:
					return( API.TAB_COLLATION_sv_FI );
				case Collation.Collation_sv_SE:
					return( API.TAB_COLLATION_sv_SE );
				case Collation.Collation_tr:
					return( API.TAB_COLLATION_tr );
				case Collation.Collation_uk:
					return( API.TAB_COLLATION_uk );
				case Collation.Collation_vi:
					return( API.TAB_COLLATION_vi );
				case Collation.Collation_zh_Hans_CN:
					return( API.TAB_COLLATION_zh_Hans_CN );
				case Collation.Collation_zh_Hant_TW:
					return ( API.TAB_COLLATION_zh_Hant_TW );
			}
			throw new ArgumentOutOfRangeException( "Unrecognized Collation" );
		}

		public static Collation FromCollation( Int32 tc )
		{
			if( tc == API.TAB_COLLATION_Binary )
				return( Collation.Collation_Binary );
			if( tc == API.TAB_COLLATION_ar )
				return( Collation.Collation_ar );
			if( tc == API.TAB_COLLATION_cs )
				return( Collation.Collation_cs );
			if( tc == API.TAB_COLLATION_cs_CI )
				return( Collation.Collation_cs_CI );
			if( tc == API.TAB_COLLATION_cs_CI_AI )
				return( Collation.Collation_cs_CI_AI );
			if( tc == API.TAB_COLLATION_da )
				return( Collation.Collation_da );
			if( tc == API.TAB_COLLATION_de )
				return( Collation.Collation_de );
			if( tc == API.TAB_COLLATION_el )
				return( Collation.Collation_el );
			if( tc == API.TAB_COLLATION_en_GB )
				return( Collation.Collation_en_GB );
			if( tc == API.TAB_COLLATION_en_US )
				return( Collation.Collation_en_US );
			if( tc == API.TAB_COLLATION_en_US_CI )
				return( Collation.Collation_en_US_CI );
			if( tc == API.TAB_COLLATION_es )
				return( Collation.Collation_es );
			if( tc == API.TAB_COLLATION_es_CI_AI )
				return( Collation.Collation_es_CI_AI );
			if( tc == API.TAB_COLLATION_et )
				return( Collation.Collation_et );
			if( tc == API.TAB_COLLATION_fi )
				return( Collation.Collation_fi );
			if( tc == API.TAB_COLLATION_fr_CA )
				return( Collation.Collation_fr_CA );
			if( tc == API.TAB_COLLATION_fr_FR )
				return( Collation.Collation_fr_FR );
			if( tc == API.TAB_COLLATION_fr_FR_CI_AI )
				return( Collation.Collation_fr_FR_CI_AI );
			if( tc == API.TAB_COLLATION_he )
				return( Collation.Collation_he );
			if( tc == API.TAB_COLLATION_hu )
				return( Collation.Collation_hu );
			if( tc == API.TAB_COLLATION_is )
				return( Collation.Collation_is );
			if( tc == API.TAB_COLLATION_it )
				return( Collation.Collation_it );
			if( tc == API.TAB_COLLATION_ja )
				return( Collation.Collation_ja );
			if( tc == API.TAB_COLLATION_ja_JIS )
				return( Collation.Collation_ja_JIS );
			if( tc == API.TAB_COLLATION_ko )
				return( Collation.Collation_ko );
			if( tc == API.TAB_COLLATION_lt )
				return( Collation.Collation_lt );
			if( tc == API.TAB_COLLATION_lv )
				return( Collation.Collation_lv );
			if( tc == API.TAB_COLLATION_nl_NL )
				return( Collation.Collation_nl_NL );
			if( tc == API.TAB_COLLATION_nn )
				return( Collation.Collation_nn );
			if( tc == API.TAB_COLLATION_pl )
				return( Collation.Collation_pl );
			if( tc == API.TAB_COLLATION_pt_BR )
				return( Collation.Collation_pt_BR );
			if( tc == API.TAB_COLLATION_pt_BR_CI_AI )
				return( Collation.Collation_pt_BR_CI_AI );
			if( tc == API.TAB_COLLATION_pt_PT )
				return( Collation.Collation_pt_PT );
			if( tc == API.TAB_COLLATION_root )
				return( Collation.Collation_root );
			if( tc == API.TAB_COLLATION_ru )
				return( Collation.Collation_ru );
			if( tc == API.TAB_COLLATION_sl )
				return( Collation.Collation_sl );
			if( tc == API.TAB_COLLATION_sv_FI )
				return( Collation.Collation_sv_FI );
			if( tc == API.TAB_COLLATION_sv_SE )
				return( Collation.Collation_sv_SE );
			if( tc == API.TAB_COLLATION_tr )
				return( Collation.Collation_tr );
			if( tc == API.TAB_COLLATION_uk )
				return( Collation.Collation_uk );
			if( tc == API.TAB_COLLATION_vi )
				return( Collation.Collation_vi );
			if( tc == API.TAB_COLLATION_zh_Hans_CN )
				return( Collation.Collation_zh_Hans_CN );
			if( tc == API.TAB_COLLATION_zh_Hant_TW )
				return ( Collation.Collation_zh_Hant_TW );
			throw new ArgumentOutOfRangeException( "Unrecognized TAB_COLLATION" );
		}
	}
}

//---------------------------------------------------------------------------//
// EOF
