//---------------------------------------------------------------------------//
// OWNER:   RAPID INSIGHT INC.                                               //
// AUTHOR:  SCOTT STEESY                                                     //
// DATE:    01/23/2013                                                       //
// PURPOSE: Reimplement the TableDefinition class from Tableau's			 //
//			DataExtract_cpp.h c++ header file in C#.						 //
//---------------------------------------------------------------------------//

using System;
using API = Tableau.DataExtractAPI;

namespace Tableau
{
	/// <summary>
	/// Represents a collection of columns, or more specifically name/type pairs.
	/// </summary>
	public class TableDefinition : IDisposable
	{
		private IntPtr m_Handle;
		internal IntPtr Handle
		{
			get { return ( m_Handle ); }
		}

		/// <summary>
		/// Creates an empty copy of a TableDefinition object, which represent a collection of columns.
		/// </summary>
		public TableDefinition()
		{
			Int32 result = API.TabTableDefinitionCreate( out m_Handle );

			if( result != API.TAB_RESULT_Success )
				throw new TableauException( ConvertEnum.FromResult( result ), API.TabGetLastErrorMessage() );
		}

		/// <summary>
		/// Calls Close()
		/// </summary>
		~TableDefinition()
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
		/// Closes the TableDefinition object and frees associated memory.
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
		/// Gets the current default collation; if unspecified, default is binary.
		/// </summary>
		/// <returns></returns>
		public Collation GetDefaultCollation()
		{
			Int32 retval;
			Int32 result = API.TabTableDefinitionGetDefaultCollation( m_Handle, out retval );

			if( result != API.TAB_RESULT_Success )
				throw new TableauException( ConvertEnum.FromResult( result ), API.TabGetLastErrorMessage() );

			return ( ConvertEnum.FromCollation( retval ) );
		}

		/// <summary>
		/// Sets the default collation for added string columns.
		/// </summary>
		/// <param name="collation"></param>
		public void SetDefaultCollation( Collation collation )
		{
			Int32 result = API.TabTableDefinitionSetDefaultCollation( m_Handle, ConvertEnum.ToCollation( collation ) );

			if( result != API.TAB_RESULT_Success )
				throw new TableauException( ConvertEnum.FromResult( result ), API.TabGetLastErrorMessage() );
		}

		/// <summary>
		/// Adds a column to the table definition; the order in which columns are added implies their column number. String columns are defined with the current default collation.
		/// </summary>
		/// <param name="name"></param>
		/// <param name="type"></param>
		public void AddColumn( String name, Type type )
		{
			Int32 result = API.TabTableDefinitionAddColumn( m_Handle, name, ConvertEnum.ToType( type ) );

			if( result != API.TAB_RESULT_Success )
				throw new TableauException( ConvertEnum.FromResult( result ), API.TabGetLastErrorMessage() );
		}

		/// <summary>
		/// Adds a column with a specific collation.
		/// </summary>
		/// <param name="name"></param>
		/// <param name="type"></param>
		/// <param name="collation"></param>
		public void AddColumnWithCollation( String name, Type type, Collation collation )
		{
			Int32 result = API.TabTableDefinitionAddColumnWithCollation( m_Handle, name, ConvertEnum.ToType( type ), ConvertEnum.ToCollation( collation ) );

			if( result != API.TAB_RESULT_Success )
				throw new TableauException( ConvertEnum.FromResult( result ), API.TabGetLastErrorMessage() );
		}

		/// <summary>
		/// Returns the number of columns in the table definition.
		/// </summary>
		/// <returns></returns>
		public Int32 GetColumnCount()
		{
			Int32 retval;
			Int32 result = API.TabTableDefinitionGetColumnCount( m_Handle, out retval );

			if( result != API.TAB_RESULT_Success )
				throw new TableauException( ConvertEnum.FromResult( result ), API.TabGetLastErrorMessage() );

			return ( retval );
		}

		/// <summary>
		/// Gives the name of the column.
		/// </summary>
		/// <param name="columnNumber"></param>
		/// <returns></returns>
		public string GetColumnName( Int32 columnNumber )
		{
			string retval;
			Int32 result = API.TabTableDefinitionGetColumnName( m_Handle, columnNumber, out retval );

			if( result != API.TAB_RESULT_Success )
				throw new TableauException( ConvertEnum.FromResult( result ), API.TabGetLastErrorMessage() );

			return ( retval );
		}

		/// <summary>
		/// Gives the type of the column.
		/// </summary>
		/// <param name="columnNumber"></param>
		/// <returns></returns>
		public Type GetColumnType( Int32 columnNumber )
		{
			Int32 retval;
			Int32 result = API.TabTableDefinitionGetColumnType( m_Handle, columnNumber, out retval );

			if( result != API.TAB_RESULT_Success )
				throw new TableauException( ConvertEnum.FromResult( result ), API.TabGetLastErrorMessage() );

			return ( ConvertEnum.FromType( retval ) );
		}
	}
}

//---------------------------------------------------------------------------//
// EOF
