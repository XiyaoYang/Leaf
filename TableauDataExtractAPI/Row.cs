//---------------------------------------------------------------------------//
// OWNER:   RAPID INSIGHT INC.                                               //
// AUTHOR:  SCOTT STEESY                                                     //
// DATE:    01/23/2013                                                       //
// PURPOSE: Reimplement the Row class from Tableau's DataExtract_cpp.h c++	 //
//			header file in C#.												 //
//---------------------------------------------------------------------------//

using System;
using API = Tableau.DataExtractAPI;

namespace Tableau
{
	/// <summary>
	/// A tuple of values to be inserted into an extract.
	/// </summary>
	public class Row : IDisposable
	{
		private IntPtr m_Handle;
		internal IntPtr Handle
		{
			get { return ( m_Handle ); }
		}

		/// <summary>
		/// Create an empty row with the specified schema.
		/// </summary>
		/// <param name="tableDefinition"></param>
		public Row( TableDefinition tableDefinition )
		{
			Int32 result = API.TabRowCreate( out m_Handle, tableDefinition.Handle );

			if ( result != API.TAB_RESULT_Success )
					throw new TableauException( ConvertEnum.FromResult( result ), API.TabGetLastErrorMessage() );
		}

		/// <summary>
		/// Calls Close()
		/// </summary>
		~Row()
		{
			Close();
		}

		#region IDisposable Members
		/// <summary>
		/// Calls Close()
		/// </summary>
		public void Dispose()
		{ Close(); }
		#endregion

		/// <summary>
		/// Closes this Row and frees associated resources.
		/// </summary>
		public void Close()
		{
			if( m_Handle != IntPtr.Zero )
			{
				Int32 result = API.TabTableDefinitionClose( m_Handle );
				m_Handle = IntPtr.Zero;

				if( result != API.TAB_RESULT_Success )
					throw new TableauException( ConvertEnum.FromResult( result ), API.TabGetLastErrorMessage() );
			}
		}

		/// <summary>
		/// Sets a column in this row to null.
		/// </summary>
		/// <param name="columnNumber"></param>
		public void SetNull( Int32 columnNumber )
		{
			Int32 result = API.TabRowSetNull( m_Handle, columnNumber );

			if( result != API.TAB_RESULT_Success )
				throw new TableauException( ConvertEnum.FromResult( result ), API.TabGetLastErrorMessage() );
		}

		/// <summary>
		/// Sets a column in this row to the specified integer value.
		/// </summary>
		/// <param name="columnNumber"></param>
		/// <param name="value"></param>
		public void SetInteger( Int32 columnNumber, Int32 value )
		{
			Int32 result = API.TabRowSetInteger( m_Handle, columnNumber, value );

			if( result != API.TAB_RESULT_Success )
				throw new TableauException( ConvertEnum.FromResult( result ), API.TabGetLastErrorMessage() );
		}

		/// <summary>
		/// Sets a column in this row to the specified double value.
		/// </summary>
		/// <param name="columnNumber"></param>
		/// <param name="value"></param>
		public void SetDouble( Int32 columnNumber, double value )
		{
			Int32 result = API.TabRowSetDouble( m_Handle, columnNumber, value );

			if( result != API.TAB_RESULT_Success )
				throw new TableauException( ConvertEnum.FromResult( result ), API.TabGetLastErrorMessage() );
		}

		/// <summary>
		/// Sets a column in this row to the specified boolean value.
		/// </summary>
		/// <param name="columnNumber"></param>
		/// <param name="value"></param>
		public void SetBoolean( Int32 columnNumber, bool value )
		{
			Int32 result = API.TabRowSetBoolean( m_Handle, columnNumber, value ? 1 : 0 );

			if( result != API.TAB_RESULT_Success )
				throw new TableauException( ConvertEnum.FromResult( result ), API.TabGetLastErrorMessage() );
		}

		/// <summary>
		/// Sets a column in this row to the specified string value.
		/// </summary>
		/// <param name="columnNumber"></param>
		/// <param name="value"></param>
		public void SetString( Int32 columnNumber, String value )
		{
			Int32 result = API.TabRowSetString( m_Handle, columnNumber, value );

			if( result != API.TAB_RESULT_Success )
				throw new TableauException( ConvertEnum.FromResult( result ), API.TabGetLastErrorMessage() );
		}

		/// <summary>
		/// Sets a column in this row to the specified string value.
		/// </summary>
		/// <param name="columnNumber"></param>
		/// <param name="value"></param>
		public void SetCharString( Int32 columnNumber, String value )
		{
			Int32 result = API.TabRowSetCharString( m_Handle, columnNumber, value );

			if( result != API.TAB_RESULT_Success )
				throw new TableauException( ConvertEnum.FromResult( result ), API.TabGetLastErrorMessage() );
		}

		/// <summary>
		/// Sets a column in this row to the specified date value.
		/// </summary>
		/// <param name="columnNumber"></param>
		/// <param name="year"></param>
		/// <param name="month"></param>
		/// <param name="day"></param>
		public void SetDate( Int32 columnNumber, Int32 year, Int32 month, Int32 day )
		{
			Int32 result = API.TabRowSetDate( m_Handle, columnNumber, year, month, day );

			if( result != API.TAB_RESULT_Success )
				throw new TableauException( ConvertEnum.FromResult( result ), API.TabGetLastErrorMessage() );
		}

		/// <summary>
		/// Sets a column in this row to the specified date/time value.
		/// </summary>
		/// <param name="columnNumber"></param>
		/// <param name="year"></param>
		/// <param name="month"></param>
		/// <param name="day"></param>
		/// <param name="hour"></param>
		/// <param name="min"></param>
		/// <param name="sec"></param>
		/// <param name="frac"></param>
		public void SetDateTime( Int32 columnNumber, Int32 year, Int32 month, Int32 day, Int32 hour, Int32 min, Int32 sec, Int32 frac )
		{
			Int32 result = API.TabRowSetDateTime( m_Handle, columnNumber, year, month, day, hour, min, sec, frac );

			if( result != API.TAB_RESULT_Success )
				throw new TableauException( ConvertEnum.FromResult( result ), API.TabGetLastErrorMessage() );
		}

		/// <summary>
		/// Sets a column in this row to the specified duration value.
		/// </summary>
		/// <param name="columnNumber"></param>
		/// <param name="day"></param>
		/// <param name="hour"></param>
		/// <param name="min"></param>
		/// <param name="sec"></param>
		/// <param name="frac"></param>
		public void SetDuration( Int32 columnNumber, Int32 day, Int32 hour, Int32 min, Int32 sec, Int32 frac )
		{
			Int32 result = API.TabRowSetDuration( m_Handle, columnNumber, day, hour, min, sec, frac );

			if( result != API.TAB_RESULT_Success )
				throw new TableauException( ConvertEnum.FromResult( result ), API.TabGetLastErrorMessage() );
		}
	}
}

//---------------------------------------------------------------------------//
// EOF
