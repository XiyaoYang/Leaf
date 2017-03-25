//---------------------------------------------------------------------------//
// OWNER:   RAPID INSIGHT INC.                                               //
// AUTHOR:  SCOTT STEESY                                                     //
// DATE:    01/23/2013                                                       //
// PURPOSE: Reimplement the TableauException class from Tableau's			 //
//			DataExtract_cpp.h c++ header file in C#.						 //
//---------------------------------------------------------------------------//

using System;

namespace Tableau
{
	public class TableauException : Exception
	{
		public TableauException( Result r, String m )
			: base( m )
		{
			m_Result = r;
		}

		public Result GetResultCode()
		{ return ( m_Result ); }

		public String GetMessage()
		{ return ( base.Message ); }

		private readonly Result m_Result;
	}
}

//---------------------------------------------------------------------------//
// EOF
