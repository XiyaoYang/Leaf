//---------------------------------------------------------------------------//
// OWNER:   RAPID INSIGHT INC.                                               //
// AUTHOR:  SCOTT STEESY                                                     //
// DATE:    01/23/2013                                                       //
// PURPOSE: Create a enum to emulate the TAB_TYPE "named list" of constants	 //
//			in the Tableau Data Extract API.								 //
//---------------------------------------------------------------------------//

using System;
using API = Tableau.DataExtractAPI;

namespace Tableau
{
	public enum Type
	{
		Type_Integer = 0x0007,			// TDE_DT_SInt32
		Type_Double = 0x000A,			// TDE_DT_DOUBLE
		Type_Boolean = 0x000B,			// TDE_DT_BOOL
		Type_Date = 0x000C,				// TDE_DT_DATE
		Type_DateTime = 0x000D,			// TDE_DT_DATETIME
		Type_Duration = 0x000E,			// TDE_DT_DURATION
		Type_CharString = 0x000F,		// TDE_DT_STR
		Type_UnicodeString = 0x0010,	// TDE_DT_WSTR
	}

	/// <summary>
	/// Safely convert between C# enum and Data Extract's exported constants
	/// </summary>
	internal static partial class ConvertEnum
	{
		public static Int32 ToType( Type tt )
		{
			switch( tt )
			{
				case Type.Type_Boolean:
					return( API.TAB_TYPE_Boolean );
				case Type.Type_CharString:
					return( API.TAB_TYPE_CharString );
				case Type.Type_Date:
					return( API.TAB_TYPE_Date );
				case Type.Type_DateTime:
					return( API.TAB_TYPE_DateTime );
				case Type.Type_Double:
					return( API.TAB_TYPE_Double );
				case Type.Type_Duration:
					return( API.TAB_TYPE_Duration );
				case Type.Type_Integer:
					return( API.TAB_TYPE_Integer );
				case Type.Type_UnicodeString:
					return( API.TAB_TYPE_UnicodeString );
			}
			throw new ArgumentOutOfRangeException( "Unrecognized Type" );
		}

		public static Type FromType( Int32 tt )
		{
			if( tt == API.TAB_TYPE_Boolean )
				return( Type.Type_Boolean );
			if( tt == API.TAB_TYPE_CharString )
				return( Type.Type_CharString );
			if( tt == API.TAB_TYPE_Date )
				return( Type.Type_Date );
			if( tt == API.TAB_TYPE_DateTime )
				return( Type.Type_DateTime );
			if( tt == API.TAB_TYPE_Double )
				return( Type.Type_Double );
			if( tt == API.TAB_TYPE_Duration )
				return( Type.Type_Duration );
			if( tt == API.TAB_TYPE_Integer )
				return( Type.Type_Integer );
			if( tt == API.TAB_TYPE_UnicodeString )
				return( Type.Type_UnicodeString );
			throw new ArgumentOutOfRangeException( "Unrecognized TAB_TYPE" );
		}
	}
}

//---------------------------------------------------------------------------//
// EOF
