//---------------------------------------------------------------------------//
// OWNER:   RAPID INSIGHT INC.                                               //
// AUTHOR:  SCOTT STEESY                                                     //
// DATE:    01/23/2013                                                       //
// PURPOSE: Reimplement the Table class from Tableau's DataExtract_cpp.h c++ //
//			header file in C#.												 //
//---------------------------------------------------------------------------//

using System;
using API = Tableau.DataExtractAPI;

namespace Tableau
{
	/// <summary>
	/// A table in the extract.
	/// </summary>
	public class Table
	{
		private IntPtr m_Handle;

		/// <summary>
		/// Creates a Table object.
		/// </summary>
		public Table( IntPtr handle )
		{ m_Handle = handle; }

		/// <summary>
		/// Queue a row for insertion; may perform insert of buffered rows.
		/// </summary>
		/// <param name="row"></param>
		public void Insert( Row row )
		{
			Int32 result = API.TabTableInsert( m_Handle , row.Handle );

			if ( result != API.TAB_RESULT_Success )
				throw new TableauException( ConvertEnum.FromResult( result ), API.TabGetLastErrorMessage() );
		}
	}
}

//---------------------------------------------------------------------------//
// EOF
