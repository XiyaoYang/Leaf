//---------------------------------------------------------------------------//
// OWNER:   RAPID INSIGHT INC.                                               //
// AUTHOR:  SCOTT STEESY                                                     //
// DATE:    01/23/2013                                                       //
// PURPOSE: Reimplement the Extract class from Tableau's DataExtract_cpp.h	 //
//			c++ header file in C#.											 //
//---------------------------------------------------------------------------//

using System;
using API = Tableau.DataExtractAPI;

namespace Tableau
{
	public class Extract : IDisposable
	{
		private IntPtr m_Handle;

		/// <summary>
		/// Create an extract object with an absolute or relative file system path. This object must be closed.
		/// </summary>
		/// <param name="path"></param>
		public Extract( String path )
		{
			Int32 result = API.TabExtractCreate( out m_Handle, path );

			if( result != API.TAB_RESULT_Success )
				throw new TableauException( ConvertEnum.FromResult( result ), API.TabGetLastErrorMessage() );
		}

		/// <summary>
		/// Calls Close()
		/// </summary>
		~Extract()
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
		/// Closes the extract and any open tables.
		/// </summary>
		public void Close()
		{
			if( m_Handle != IntPtr.Zero )
			{
				int result = API.TabExtractClose( m_Handle );
				m_Handle = IntPtr.Zero;

				if( result != API.TAB_RESULT_Success )
					throw new TableauException( ConvertEnum.FromResult( result ), API.TabGetLastErrorMessage() );
			}
		}

		/// <summary>
		/// Creates and adds table to the extract
		/// </summary>
		/// <param name="name"></param>
		/// <param name="tableDefinition"></param>
		/// <returns></returns>
		public Table AddTable( String name, TableDefinition tableDefinition )
		{
			IntPtr retval;
			Int32 result = API.TabExtractAddTable( m_Handle, name, tableDefinition.Handle, out retval );

			if( result != API.TAB_RESULT_Success )
				throw new TableauException( ConvertEnum.FromResult( result ), API.TabGetLastErrorMessage() );

			return ( new Table( retval ) );
		}
	}
}

//---------------------------------------------------------------------------//
// EOF
